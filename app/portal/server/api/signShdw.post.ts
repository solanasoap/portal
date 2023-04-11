import { Keypair } from "@solana/web3.js";
import crypto from "crypto";
import nacl from "tweetnacl";
import bs58 from "bs58";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  // Load a local keypair.
  // const keypair = Keypair.fromSecretKey(Buffer.from(JSON.parse(process.env.SOAP_KEYPAIR)));
  console.log("keypair HERE", config.soapKeypair);
  const keypair = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(config.soapKeypair))
  );
  console.log("Backend Keypair Pubkey: ", keypair.publicKey);

  console.log(body);
  const soapAddress = body.soapAddress;

  // Sign image upload
  const imageFileName = body.imageFileName;
  const fileExtension = imageFileName.split(".").pop();
  console.log("File extension of incoming file: ", fileExtension);

  const uniqueImageFileName = `${soapAddress}.${fileExtension}`;
  console.log("Backend unique Image filename: ", uniqueImageFileName);

  const hashSumImage = crypto.createHash("sha256");
  hashSumImage.update(uniqueImageFileName);
  const imageFileNameHashed = hashSumImage.digest("hex");

  // Sign json upload
  const uniqueJsonFileName = `${soapAddress}.json`;
  const hashSumJson = crypto.createHash("sha256");
  hashSumJson.update(uniqueJsonFileName);
  const jsonFileNamesHashed = hashSumJson.digest("hex");

  let msgImage = `Shadow Drive Signed Message:\nStorage Account: ${config.public.shadowSoapBucket}\nUpload files with hash: ${imageFileNameHashed}`;

  console.log("\nShadow Drive Message to be signed for IMAGE: ", msgImage);
  const encodedMessageImage = new TextEncoder().encode(msgImage);
  const signedMessageImage = nacl.sign.detached(
    encodedMessageImage,
    keypair.secretKey
  );
  const signatureImage = bs58.encode(signedMessageImage);
  console.log("\nSignatureImage of message: ", signatureImage);

  let msgJson = `Shadow Drive Signed Message:\nStorage Account: ${config.public.shadowSoapBucket}\nUpload files with hash: ${jsonFileNamesHashed}`;

  console.log("\nShadow Drive Message to be signed for JSON: ", msgJson);
  const encodedMessage = new TextEncoder().encode(msgJson);
  const signedMessageJson = nacl.sign.detached(
    encodedMessage,
    keypair.secretKey
  );
  const signatureJson = bs58.encode(signedMessageJson);
  console.log("\nSignature Json of message: ", signatureJson);

  return {
    signedMessageImage: signatureImage,
    uniqueFileNameImage: uniqueImageFileName,
    signedMessageJson: signatureJson,
    uniqueFileNameJson: uniqueJsonFileName,
    // uniqueSoapId: soapAddress,
  };
});
