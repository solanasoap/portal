// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import * as fs from "fs"
import { bundlrStorage, keypairIdentity, Metaplex, KeypairSigner, SendTokensInput, findMetadataPda, token } from '@metaplex-foundation/js';
import { Keypair, clusterApiUrl, Connection, PublicKey, LAMPORTS_PER_SOL, SystemProgram, Transaction, VersionedTransaction, sendAndConfirmTransaction } from '@solana/web3.js';
import { createAssociatedTokenAccountInstruction, getAccount, createMint, createMintToInstruction, getAssociatedTokenAddress, getMinimumBalanceForRentExemptMint, getOrCreateAssociatedTokenAccount, mintTo, transfer } from '@solana/spl-token'


// get params from query, to whom and which soap
// create metaplex identity with that soap's mint authority keypair
// mint one of that soap to the target address
// respond with tx signature


// Load a local keypair.
const keypair = Keypair.fromSecretKey(Buffer.from(JSON.parse(process.env.SOAP_KEYPAIR)));

// Set up foundation
const connection = new Connection("https://broken-green-forest.solana-mainnet.discover.quiknode.pro/" + process.env.NEXT_PUBLIC_QUICKNODE_API_KEY + "/");
const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(keypair))
console.log("Public key of keypair being used: ", keypair.publicKey.toBase58())


export default async function handler(req, res) {
    const start = Date.now();

    if (req.method !== 'POST' || req.body.secret !== process.env.NEXT_PUBLIC_API_SECRET) {
        res.status(418).json({ body: 'THIS AINT NO POST, STOP SENDING ME SHIT' })
        return
    }

    console.log("\nMINTING SFT\n")

    // Extract soap request details
    let soapMintDetails: soapMintRequest = req.body
    const toPublicKey: PublicKey = new PublicKey(soapMintDetails.toPublicKey)
    const soapAddress: PublicKey = new PublicKey(soapMintDetails.soapAddress)

    // console.log("Sending soap " + soapAddress.toBase58() + " to " + toPublicKey.toBase58() + "\n")

    // Create keypair from metaplex identity
    const soapKeyPair = Keypair.fromSecretKey(metaplex.identity().secretKey)
    
    //get associated token account address for target wallet
    const tokenATA = await getAssociatedTokenAddress(soapAddress, toPublicKey);
    
    // Create new transaction object
    let soapMintTransaction = new Transaction()
    
    try {
        const tokenAccount = await getAccount(connection, tokenATA, 'finalized');
        console.log("Token Account exists: ", tokenAccount.address.toBase58())
        // FIXME: This hardcodes to 1 soap per wallet of unique type. It's pretty effective defense, but also pretty shit
        if (false) {
            console.log("Not minting, one unique soap per wallet.")
            res.status(405).json({ error: 'Error: You already have this soap.' })
            return
        }
    } catch (error) {
        console.log("ATA " + tokenATA + " doesn't exist yet. Adding create to instruction.")
        // FIXME: Create seperate payer wallet to seperate responsibilities from BCN...
        soapMintTransaction.add(
            createAssociatedTokenAccountInstruction(
                metaplex.identity().publicKey, //Payer 
                tokenATA, //Associated token account 
                toPublicKey, //Token account owner
                soapAddress, //Mint
              )
        )
    }


    soapMintTransaction.add(
          createMintToInstruction(
            soapAddress, //Mint
            tokenATA, //Destination Token Account
            metaplex.identity().publicKey, //Authority
            1,//number of tokens
          )
    )

    // console.log("Soap mint transaction: ", soapMintTransaction)

    // FIXME: sendTransaction is deprecated, replace
    const transactionId =  await connection.sendTransaction(soapMintTransaction, [soapKeyPair]);

    const end = Date.now();
    console.log("Mint tx: ", transactionId)
    console.log(`Execution time: ${end - start} ms\n`);

    res.status(200).json({ "tx": transactionId })
}


type soapMintRequest = {
    toPublicKey: PublicKey,
    soapAddress: PublicKey,
    dispenserName: string, // this is for guard
    amount?: number
}

type soapObject = {
    soapAddress: PublicKey,
    mintAuthority: KeypairSigner,
}

// solanasoap.lol/api/dispense?
//      & toPublicKey=9uBX3ASjxWvNBAD1xjbVaKA74mWGZys3RGSF7DdeDD3F
//      & soapAddress=HKPcjAi699egocGNqMVEEkPqYAwPZ12oqFWKfzVcCudV




// solanasoap.lol/dispenser/<soapAddress>
// solanasoap.lol/dispenser/HKPcjAi699egocGNqMVEEkPqYAwPZ12oqFWKfzVcCudV
