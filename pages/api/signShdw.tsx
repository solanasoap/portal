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
    // const uniqueKeypair = Keypair.generate()

    const jsonReqBody = req.body;
    const soapAddress = jsonReqBody.soapAddress;
    console.log("JSON Request Body SignShdw: ", jsonReqBody)


    // Sign image upload
    const imageFileName = jsonReqBody.imageFileName;
    const fileExtension = imageFileName.split('.').pop();
    console.log("File extension of incoming file: ", fileExtension)

    const uniqueImageFileName = `${soapAddress}.${fileExtension}`
    console.log("Backend unique Image filename: ", uniqueImageFileName)

    const hashSumImage = crypto.createHash("sha256");
    hashSumImage.update(uniqueImageFileName)
    const imageFileNameHashed = hashSumImage.digest("hex")

    // Sign json upload
    const uniqueJsonFileName = `${soapAddress}.json`
    const hashSumJson = crypto.createHash("sha256");
    hashSumJson.update(uniqueJsonFileName)
    const jsonFileNamesHashed = hashSumJson.digest("hex")


    if (req.method == 'POST') {


        let msgImage = `Shadow Drive Signed Message:\nStorage Account: ${process.env.NEXT_PUBLIC_SHDW_SOAP_BUCKET}\nUpload files with hash: ${imageFileNameHashed}`;

        console.log("\nShadow Drive Message to be signed for IMAGE: ", msgImage)
        const encodedMessageImage = new TextEncoder().encode(msgImage);
        const signedMessageImage = nacl.sign.detached(encodedMessageImage, keypair.secretKey);
        const signatureImage = bs58.encode(signedMessageImage)
        console.log("\nSignatureImage of message: ", signatureImage)


        let msgJson = `Shadow Drive Signed Message:\nStorage Account: ${process.env.NEXT_PUBLIC_SHDW_SOAP_BUCKET}\nUpload files with hash: ${jsonFileNamesHashed}`;

        console.log("\nShadow Drive Message to be signed for JSON: ", msgJson)
        const encodedMessage = new TextEncoder().encode(msgJson);
        const signedMessageJson = nacl.sign.detached(encodedMessage, keypair.secretKey);
        const signatureJson = bs58.encode(signedMessageJson)
        console.log("\nSignature Json of message: ", signatureJson)


        res.status(200).json({
            signedMessageImage: signatureImage,
            uniqueFileNameImage: uniqueImageFileName,
            signedMessageJson: signatureJson,
            uniqueFileNameJson: uniqueJsonFileName,
            // uniqueSoapId: soapAddress,
        });
    }

}