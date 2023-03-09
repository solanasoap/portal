import { Connection, Keypair } from '@solana/web3.js';
import nacl from 'tweetnacl';
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes';
import { NextRequest } from 'next/server';
import crypto from "crypto";

// Load a local keypair.
const keypair = Keypair.fromSecretKey(Buffer.from(JSON.parse(process.env.SOAP_KEYPAIR)));
console.log("🚀 ~ file: signShdw.tsx:9 ~ keypair:", keypair.publicKey)


// Set up foundation
const connection = new Connection("https://rpc.helius.xyz/?api-key=" + process.env.NEXT_PUBLIC_HELIUS_API_KEY, 'finalized');

export default async function handler(req: NextRequest, res) {
    const uniqueKeypair = Keypair.generate()

    const jsonReqBody = req.body;
    console.log("JSON Request Body SignShdw: ", jsonReqBody)


    const fileName = jsonReqBody.fileName;
    const fileExtension = fileName.split('.').pop();
    console.log("File extension of incoming file: ", fileExtension)

    const uniqueFileName = `${uniqueKeypair.publicKey}.${fileExtension}`
    console.log("Backend unique filename: ", uniqueFileName)


    const hashSum = crypto.createHash("sha256");
    hashSum.update(uniqueFileName)
    const fileNamesHashed = hashSum.digest("hex")


    if (req.method == 'POST') {


        let msg = `Shadow Drive Signed Message:\nStorage Account: ${process.env.NEXT_PUBLIC_SHDW_SOAP_BUCKET}\nUpload files with hash: ${fileNamesHashed}`;

        console.log("\nShadow Drive Message to be signed: ", msg)
        const encodedMessage = new TextEncoder().encode(msg);
        const signedMessage = nacl.sign.detached(encodedMessage, keypair.secretKey);
        const signature = bs58.encode(signedMessage)
        console.log("\nSignature of message: ", signature)


        res.status(200).json({
            signedMessage: signature,
            uniqueFileName: uniqueFileName
        });
    }

}