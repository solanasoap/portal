import { NextPage } from "next"
import Head from "next/head"
import { Connection, PublicKey } from "@solana/web3.js";
import { useState } from "react";
// import fetch, { FormData } from "node-fetch";
import { ShadowFile, ShdwDrive } from "@shadow-drive/sdk";
import { JsonMetadata } from "@metaplex-foundation/js";
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

type UploadResponse = {
    fileName: string,
    signatureImage: string,
    signatureMetadata: string
}

async function uploadSoap(soapName: string, soapDescription: string, imageFile: File) {
    // Request to pre-sign message with the filename on the backend
    const shadowSigner = await fetch("/api/signShdw", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({ // We only need this for the file extension
            imageFileName: imageFile.name
        })
    });

    const signShdwJsonResponse = (await shadowSigner.json());

    // Upload image to ShadowDrive
    const formData = new FormData();
    formData.append("file", imageFile, signShdwJsonResponse.uniqueFileNameImage);
    formData.append("message", signShdwJsonResponse.signedMessageImage as string);
    formData.append("signer", process.env.NEXT_PUBLIC_SOAP_PUBKEY as string);
    formData.append("storage_account", process.env.NEXT_PUBLIC_SHDW_SOAP_BUCKET as string);
    formData.append("fileNames", [signShdwJsonResponse.uniqueFileNameImage].toString());
    const imageUploadResponse = await fetch("https://shadow-storage.genesysgo.net/upload", {
        method: "POST",
        body: formData
    });

    const imageUri = (await imageUploadResponse.json()).finalized_locations[0];
    console.log("Shadow Soap image URI: ", imageUri)

    const soapMetadata = createMetadata(soapName, soapDescription, imageUri)
    console.log("Soap metadata: ", soapMetadata)

    const metadataFile = new File([JSON.stringify(soapMetadata)], signShdwJsonResponse.uniqueFileNameJson, { type: "text/plain" })

    // Upload metadata to ShadowDrive
    const formDataJson = new FormData();
    formDataJson.append("file", metadataFile, signShdwJsonResponse.uniqueFileNameJson);
    formDataJson.append("message", signShdwJsonResponse.signedMessageJson as string);
    formDataJson.append("signer", process.env.NEXT_PUBLIC_SOAP_PUBKEY as string);
    formDataJson.append("storage_account", process.env.NEXT_PUBLIC_SHDW_SOAP_BUCKET as string);
    formDataJson.append("fileNames", [signShdwJsonResponse.uniqueFileNameJson].toString());
    const JsonUploadResponse = await fetch("https://shadow-storage.genesysgo.net/upload", {
        method: "POST",
        body: formDataJson
    });

    const jsonUri = (await JsonUploadResponse.json()).finalized_locations[0];
    console.log("Shadow Soap image URI: ", jsonUri)

}

function createMetadata(name: string, description: string, imageUri: string) {
    // NFT Metadata
    const jsonMetadata = { //FIXME Get data from json request
        name: name,
        symbol: "SOAP",
        description: description,
        seller_fee_basis_points: 10000,
        image: imageUri,
        // external_url: req.body.external_url,
        // attributes: req.body.attributes,
        properties: {
            // creators: [
            //     {
            //         // main soap creator
            //         address: metaplex.identity().publicKey.toBase58(),
            //         share: 100,
            //     }
            // ],
            category: "image"
        },
        collection: {
            name: "SOAP",
            family: "SOAP"
        }
    }

    return jsonMetadata;
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
                    <button type="submit" onClick={() => uploadSoap(name, description, image)}>Submit</button>
                </form>
            </main>
        </div>
    )
}

export default Creator

