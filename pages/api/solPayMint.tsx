import { clusterApiUrl, Connection, Keypair, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
import { createTransferCheckedInstruction, getAccount, getAssociatedTokenAddress, getMint } from '@solana/spl-token';
import { isKeypairSigner, Metaplex, Signer } from '@metaplex-foundation/js';
import { memo } from 'react';
import axios, { Axios } from 'axios';

// Load a local keypair.
const keypair = Keypair.fromSecretKey(Buffer.from(JSON.parse(process.env.SOAP_KEYPAIR)));

// Set up foundation
const connection = new Connection(process.env.NEXT_PUBLIC_RPC_ENDPOINT + process.env.NEXT_PUBLIC_HELIUS_API_KEY, 'finalized');
const metaplex = new Metaplex(connection);

export default async function handler(req, res) {
    console.log("\nrequest user agent: ", req.headers['user-agent'])
    const soapToMint = req.query.soap
    const soapPubKey = new PublicKey(soapToMint)
    const start = Date.now();

    const soap = await metaplex.nfts().findByMint({ mintAddress: soapPubKey });

    if (req.method == 'GET') {
        const label = soap.json.name || "soap";
        const icon = soap.json.image || "https://imgur.com/iW0W8lK";

        res.status(200).json({
            label,
            icon,
        });
    }

    if (req.method == 'POST') {
        let txResponse: string = ""

        // Account provided in the transaction request body by the wallet.
        const accountField = req.body?.account;
        if (!accountField) throw new Error('missing account');

        const toPublicKey = new PublicKey(accountField);

        console.log(`Solana Pay Mint: request to mint soap ${soapToMint} to ${toPublicKey.toBase58()}`)

        // TODO: POST to /dispense to mint soap to person
        await axios
            .post(`https://${process.env.NEXT_PUBLIC_BASE_URL}/api/dispense`, {
                toPublicKey: toPublicKey,
                soapAddress: soapToMint,
                secret: process.env.NEXT_PUBLIC_API_SECRET
            }
            )
            .then(res => {
                txResponse = "Mint soap"
                console.log("tx: ", res.data)
            })
            .catch(err => {
                if (err.response.status == 403) {
                    console.log("Forbidden: Wallet already has this soap.")
                    txResponse = "You already have this soap! Won't mint."
                } else if (err.response.status == 500) {
                    txResponse = "Error, please try again later"
                } else {
                    console.log('error in request', err.response.data);
                }
            });

        // create an empty transaction
        // Get a recent blockhash to include in the transaction
        const { blockhash, lastValidBlockHeight } = await (connection.getLatestBlockhash('finalized'))

        const transaction = new Transaction({
            feePayer: keypair.publicKey,
            blockhash: blockhash,
            lastValidBlockHeight: lastValidBlockHeight,
            signatures: [
                // {signature: null, publicKey: keypair.publicKey},
                // {signature: null, publicKey: new PublicKey(accountField)},
            ]
        })


        const memo = Buffer.from("Mint soap", "utf-8")
        transaction.add(
            new TransactionInstruction({
                keys: [
                    { pubkey: new PublicKey(accountField), isSigner: true, isWritable: true },
                    { pubkey: keypair.publicKey, isSigner: true, isWritable: true },
                ],
                data: memo,
                programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
            })
        )

        // We sign cus fee payer
        transaction.sign(keypair)

        // Serialize and return the unsigned transaction.
        const serializedTransaction = transaction.serialize({
            verifySignatures: false,
            requireAllSignatures: false,
        });

        const base64Transaction = serializedTransaction.toString('base64');
        const message = txResponse; // FIXME add soap name?

        res.status(200).json({ transaction: base64Transaction, message });
    }

}