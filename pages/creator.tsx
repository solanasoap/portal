import { NextPage } from "next"
import Head from "next/head"
import { Connection, PublicKey } from "@solana/web3.js";
import { useState } from "react";
// import fetch, { FormData } from "node-fetch";
import { ShadowFile, ShdwDrive } from "@shadow-drive/sdk";
// import { File } from "buffer";

// DONE User fills out form to create a soap with Name & Description
// DONE User uploads image
// DONE Frontend sends file size and extension to backend
// DONE Backend generates unique ID
// Backend signs message for both image (with extension) and .json metadata using the unique ID for both
// Backend sends back signed Shadow Drive upload messages
// Frontend uploads picture to Shadow Drive
// Frontend generates a JSON metadata with image URI
// Frontend sends file name of JSON Metadata to backend
// Backend sends back signed Shadow Drive upload message
// Frontend uploads metadata JSON to Shadow Drive
// Frontend sends metadata URI & Name to backend
// <Backend creates Soap through contract>
// Backend sends to frontend the Soap address (pubkey)

// https://shdw-drive.genesysgo.net/EBK6SU7F3HmMoMuhYocd8b1bbbKnJnYBg72cM624K8a8/SOLANA%20BUILD%20STATION%2024.02.2023-4161.jpg

const storageAcc = new PublicKey(process.env.NEXT_PUBLIC_SHDW_SOAP_BUCKET);

type UploadResponse = {
    fileName: string,
    signatureImage: string,
    signatureMetadata: string
}

async function uploadSoap(name: string, description: string, connection: Connection, imageFile: File) {
    // Request to pre-sign message with the filename on the backend
    const shadowSigner = await fetch("/api/signShdw", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({ // Don't need this really
            fileName: imageFile.name
        })
    });

    const signShdwJsonResponse = (await shadowSigner.json());

    console.log("Frontend unique filename: ", signShdwJsonResponse.uniqueFileName)
    const renamedFile = new File([imageFile], signShdwJsonResponse.uniqueFileName)

    // Upload to ShadowDrive
    const formData = new FormData();
    formData.append("file", imageFile, signShdwJsonResponse.uniqueFileName);
    formData.append("message", signShdwJsonResponse.signedMessage as string);
    formData.append("signer", process.env.NEXT_PUBLIC_SOAP_PUBKEY as string);
    formData.append("storage_account", process.env.NEXT_PUBLIC_SHDW_SOAP_BUCKET as string);
    formData.append("fileNames", [signShdwJsonResponse.uniqueFileName].toString());
    const response = await fetch("https://shadow-storage.genesysgo.net/upload", {
        method: "POST",
        body: formData
    });


}

const Creator: NextPage = (props) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Do something with name, description, and image
    };

    return (
        <div className="px-5">
            <Head>
                <title>Create a Soap</title>
                <meta name="description" content="Create a Soap" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" href="/favicon.ico" />
            </Head>
            <main >
                <form onSubmit={handleSubmit}>
                    <label>
                        Name:
                        <input type="text" value={name} onChange={handleNameChange} />
                    </label>
                    <br />
                    <label>
                        Description:
                        <textarea value={description} onChange={handleDescriptionChange} />
                    </label>
                    <br />
                    <label>
                        Image:
                        <input type="file" onChange={handleImageChange} />
                    </label>
                    <br />
                    <button type="submit" onClick={() => uploadSoap("", "", new Connection("https://api.mainnet-beta.solana.com"), image)}>Submit</button>
                </form>
            </main>
        </div>
    )
}

export default Creator

