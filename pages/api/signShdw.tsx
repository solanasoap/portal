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
    const uniqueFileName = Keypair.generate()
    // console.log(req);
    const json = req.body;
    console.log("🚀 ~ file: signShdw.tsx:15 ~ handler ~ json:", json)


    const fileName = json.fileName;
    console.log("🚀 ~ file: signShdw.tsx:23 ~ handler ~ fileName:", fileName)

    const hashSum = crypto.createHash("sha256");
    const hashedFileNames = hashSum.update(fileName)
    const fileNamesHashed = hashSum.digest("hex")


    if (req.method == 'POST') {


        let msg = `Shadow Drive Signed Message:\nStorage Account: ${process.env.NEXT_PUBLIC_SHDW_SOAP_BUCKET}\nUpload files with hash: ${fileNamesHashed}`;

        console.log("🚀 ~ file: signShdw.tsx:24 ~ handler ~ msg:", msg)
        const encodedMessage = new TextEncoder().encode(msg);
        const signedMessage = nacl.sign.detached(encodedMessage, keypair.secretKey);
        const signature = bs58.encode(signedMessage)
        console.log("🚀 ~ file: signShdw.tsx:29 ~ handler ~ signature:", signature)


        res.status(200).json({
            signedMessage: signature,
            uniqueFileName: uniqueFileName.publicKey
        });
    }

}