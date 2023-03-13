// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { keypairIdentity, Metaplex, KeypairSigner } from '@metaplex-foundation/js';
import { Keypair, Connection, PublicKey, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import { createAssociatedTokenAccountInstruction, getAccount, createMintToInstruction, getAssociatedTokenAddress, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { MintSoapInstructionAccounts, PROGRAM_ID, createMintSoapInstruction } from '../../lib/generated';


// get params from query, to whom and which soap
// create metaplex identity with that soap's mint authority keypair
// mint one of that soap to the target address
// respond with tx signature


// Load a local keypair.
const keypair = Keypair.fromSecretKey(Buffer.from(JSON.parse(process.env.SOAP_KEYPAIR)));

// Set up foundation
const connection = new Connection(process.env.NEXT_PUBLIC_RPC_ENDPOINT + process.env.NEXT_PUBLIC_HELIUS_API_KEY, 'confirmed');
const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(keypair))
console.log("Public key of keypair being used: ", keypair.publicKey.toBase58())


export default async function handler(req, res) {
    const start = Date.now();

    if (req.method !== 'POST' || req.body.secret !== process.env.NEXT_PUBLIC_API_SECRET) {
        res.status(418).json({ body: 'THIS AINT NO POST, STOP SENDING ME SHIT' })
        return
    }

    console.log("\n\nMinting Soap\n")

    // Extract soap request details
    let soapMintDetails: soapMintRequest = req.body
    const toPublicKey: PublicKey = new PublicKey(soapMintDetails.toPublicKey)
    const soapAddress: PublicKey = new PublicKey(soapMintDetails.soapAddress)

    // console.log("Sending soap " + soapAddress.toBase58() + " to " + toPublicKey.toBase58() + "\n")

    // Create keypair from metaplex identity
    const soapKeyPair = Keypair.fromSecretKey(metaplex.identity().secretKey)

    //get associated token account address for target wallet
    const tokenATA = await getAssociatedTokenAddress(soapAddress, toPublicKey);

    // My God need much better error handling here. Eg. if Pot Empty, user already has soap etc.
    const tokenAccountBalance = await connection.getBalance(tokenATA).catch();
    if (tokenAccountBalance == 0) { console.log("Token acc doesn't exist for user, continuing.") }
    if (tokenAccountBalance != 0) {
        console.log("Token Account exists: ");
        console.log("Not minting, one unique soap per wallet.");
        res.status(418).json({ error: 'Error: You already have this soap.' });
        return;
    }

    const soap = await metaplex.nfts().findByMint({ mintAddress: soapAddress })
    const potBalance = await connection.getBalance(soap.mint.mintAuthorityAddress)

    const soapDetails: soapDetails = {
        Address: soapAddress,
        UpdateAuthority: soap.updateAuthorityAddress,
        PotAddress: soap.mint.mintAuthorityAddress,
        PotBalance: potBalance
    }

    const mintSoapIxAccs: MintSoapInstructionAccounts = {
        mintAccount: soapDetails.Address,
        pot: soapDetails.PotAddress,
        associatedTokenAccount: tokenATA,
        payer: metaplex.identity().publicKey,
        destinationWallet: toPublicKey,
        creator: soapDetails.UpdateAuthority,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    }

    const mintSoapIx = createMintSoapInstruction(
        mintSoapIxAccs,
        PROGRAM_ID
    )

    // Create new transaction object
    let soapMintTransaction = new Transaction()
    soapMintTransaction.add(mintSoapIx)

    // console.log("Soap mint transaction: ", soapMintTransaction)
    const transactionId = await sendAndConfirmTransaction(connection, soapMintTransaction, [soapKeyPair], { commitment: 'confirmed' }).catch(e => {
        console.log("Error in MintSoap: ", e)
        res.status(403).json({ "error": "Failed to mint. Try again." });
        return;
    });

    const end = Date.now();
    console.log("Mint tx: ", transactionId)
    console.log(`Execution time: ${end - start} ms\n`);

    res.status(200).json({ "tx": transactionId })
}


type soapMintRequest = {
    toPublicKey: PublicKey,
    soapAddress: PublicKey,
    dispenserName: string, // DEPRECATED this is for guard
    amount?: number
}

// This should really be in my lib types, as it's used at multiple places
type soapDetails = {
    Address: PublicKey,
    UpdateAuthority: PublicKey,
    PotAddress: PublicKey,
    PotBalance: number,
}
