<script setup lang="ts">
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { Keypair } from "@solana/web3.js";
import { WalletMultiButton, useWallet } from "solana-wallets-vue";
import { Metaplex, Pda } from "@metaplex-foundation/js";
import {
  CreateInstructionAccounts,
  PROGRAM_ID,
  createCreateInstruction,
  CreateInstructionArgs,
} from "../../../lib/generated";
import { POT_TAG } from "../../../lib/constants";
import { connection } from "~/contants";
import { PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import { Transaction } from "@solana/web3.js";

const { publicKey, sendTransaction, select, connect } = useWallet();
const config = useRuntimeConfig();
const { $toast } = useNuxtApp();

const name = useState(() => "");
const description = useState("description", () => "");
const image = useState<File | null>("image", () => null);
const loading = useState("loading", () => false);
const errors = useState("errors", () => ({
  wallet: "",
}));
const soap = useState("soap", () => "");

const notifySoapCreated = () => $toast.success("Soap Created! Redirecting...");
const notifySoapDismissed = () => $toast.error("Transaction rejected!");

const handleImageChange = (event: any) => {
  const MAX_FILE_SIZE = 3000; // 3MB
  const fileSizeKiloBytes = event.target.files[0].size / 1024;
  if (fileSizeKiloBytes > MAX_FILE_SIZE) {
    alert("File size is greater than maximum limit of 3MB.");
    return;
  } else if (fileSizeKiloBytes < MAX_FILE_SIZE) {
    image.value = event.target.files[0];
  }
};

const submitSoapCreation = async () => {
  loading.value = true;
  if (!publicKey.value) throw new WalletNotConnectedError();
  console.log("Image: ", image.value);
  if (!image.value) {
    alert("You did not upload an image.");
    return;
  }
  if (!name.value || !description.value) {
    alert("Fill out all the details.");
  }

  // Create new keypair to use as soap address
  const newSoapKeypair = Keypair.generate();
  console.log("got here");
  const jsonUri = await uploadSoap(
    name.value,
    description.value,
    image.value,
    newSoapKeypair.publicKey.toBase58()
  );
  console.log("JSON URI: ", jsonUri.toString());
  const soapAddress = newSoapKeypair.publicKey;

  const pot = Pda.find(PROGRAM_ID, [
    POT_TAG,
    soapAddress.toBuffer(),
    publicKey.value.toBuffer(),
  ]);
  console.log("Pot Address: ", pot.toBase58());
  const metadataAddress = Metaplex.make(connection).nfts().pdas().metadata({
    mint: newSoapKeypair.publicKey,
  });
  console.log("Soap metadata Address:", metadataAddress.toBase58());

  const ixAccs: CreateInstructionAccounts = {
    payer: publicKey.value,
    // userProfile: publicKey,
    pot: pot,
    mintAccount: newSoapKeypair.publicKey,
    metadataAccount: metadataAddress,
    metadataProgram: TOKEN_METADATA_PROGRAM_ID,
  };

  const ixArgs: CreateInstructionArgs = {
    soapTitle: name.value,
    soapSymbol: "SOAP",
    soapUri: jsonUri.toString(),
  };

  const ix = createCreateInstruction(ixAccs, ixArgs, PROGRAM_ID);

  const {
    context: { slot: minContextSlot },
    value: { blockhash, lastValidBlockHeight },
  } = await connection.getLatestBlockhashAndContext();

  const transaction = new Transaction({
    feePayer: publicKey.value,
    lastValidBlockHeight,
    blockhash: blockhash,
  }).add(ix);

  // const transaction = new Transaction({
  //     feePayer: publicKey,
  //     lastValidBlockHeight,
  //     blockhash: blockhash
  // }).add(SystemProgram.transfer({
  //     fromPubkey: publicKey,
  //     toPubkey: new PublicKey('9h2Qd11CoMVtMftrGcvYN2ySaUSEisJGAQrv6hSWgc7T'), // replace the publickey with desred secondary wallet
  //     lamports: 1000000, // transfering 1 SOL
  // }))

  // Need to sign with the new soaps keypair
  transaction.partialSign(newSoapKeypair);

  console.log(
    "Serialized TX: ",
    transaction.serialize({ requireAllSignatures: false }).toString("base64")
  );

  const signature = await sendTransaction(transaction, connection, {
    minContextSlot,
  }).catch((e) => {
    errors.value = { wallet: "AHH" };
    console.log("Error in sending transaction: ", e);
    notifySoapDismissed();
  });

  if (!signature) return (loading.value = false);

  console.log("Signature: ", signature);

  await connection.confirmTransaction({
    blockhash,
    lastValidBlockHeight,
    signature,
  });
  console.log("Soap minted. TX: ", signature);
  notifySoapCreated();
  soap.value = soapAddress.toBase58();
  // Navigate to soap fundpot page. Justin wont like this lmao
  //TODO   router.push(`/fundPot?soapAddress=${soapAddress.toBase58()}`);
  loading.value = false;
};

async function uploadSoap(
  soapName: string,
  soapDescription: string,
  imageFile: File,
  soapAddress: string
) {
  // Return value is a link to the JSON metadata URI on Shadow Drive
  // EG. https://shdw-drive.genesysgo.net/4T16TQNnnc1x96avUQzQZ9qHMo54sS4tsuEUW2bumHtu/BvGw2bJ9p61Zp4RWW8v7HELEPNi6d2hsXuGg3h1jmVYw.json
  // This function uploads the soap's image to a specified Shadow Drive bucket,
  // assembles a json metadata with it and uploads that too to shadow.
  // Both the image and json file use the same uniquely generated filename from /api/signShdw

  // Request to pre-sign message with the filename on the backend
  console.log("here 2");
  const signShdwJsonResponse = await $fetch("/api/signShdw", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      imageFileName: imageFile.name,
      soapAddress: soapAddress,
    }),
  });
  console.log("here 3");
  // Upload image to ShadowDrive
  const formData = new FormData();
  formData.append("file", imageFile, signShdwJsonResponse.uniqueFileNameImage);
  formData.append("message", signShdwJsonResponse.signedMessageImage as string);
  formData.append("signer", config.public.soapPubkey as string);
  formData.append("storage_account", config.public.shadowSoapBucket as string);
  formData.append(
    "fileNames",
    [signShdwJsonResponse.uniqueFileNameImage].toString()
  );
  const imageUploadResponse = await fetch(
    "https://shadow-storage.genesysgo.net/upload",
    {
      method: "POST",
      body: formData,
    }
  );
  console.log("here 4");
  const imageUri = (await imageUploadResponse.json()).finalized_locations[0];
  console.log("Shadow Soap image URI: ", imageUri);

  // Create Metadata JSON file for Soap
  const soapMetadata = createMetadata(soapName, soapDescription, imageUri);
  console.log("Soap metadata: ", soapMetadata);

  const metadataFile = new File(
    [JSON.stringify(soapMetadata)],
    signShdwJsonResponse.uniqueFileNameJson,
    { type: "text/plain" }
  );

  // Upload metadata to ShadowDrive
  const formDataJson = new FormData();
  formDataJson.append(
    "file",
    metadataFile,
    signShdwJsonResponse.uniqueFileNameJson
  );
  formDataJson.append(
    "message",
    signShdwJsonResponse.signedMessageJson as string
  );
  formDataJson.append("signer", config.public.soapPubkey as string);
  formDataJson.append(
    "storage_account",
    config.public.shadowSoapBucket as string
  );
  formDataJson.append(
    "fileNames",
    [signShdwJsonResponse.uniqueFileNameJson].toString()
  );
  const JsonUploadResponse = await fetch(
    "https://shadow-storage.genesysgo.net/upload",
    {
      method: "POST",
      body: formDataJson,
    }
  );

  const jsonUri = (await JsonUploadResponse.json()).finalized_locations[0];
  console.log("Shadow Soap JSON URI: ", jsonUri);

  return [jsonUri];
}

function createMetadata(name: string, description: string, imageUri: string) {
  // NFT Metadata
  const jsonMetadata = {
    name: name,
    symbol: "SOAP",
    description: description,
    seller_fee_basis_points: 10000,
    image: imageUri,
    // external_url: req.body.external_url,
    // attributes: req.body.attributes,
    properties: {
      category: "image",
    },
    collection: {
      name: "SOAP",
      family: "SOAP",
    },
  };

  return jsonMetadata;
}
</script>

<template>
  <div class="px-5 flex justify-center items-center pt-8">
    <Head>
      <title>Create a Soap</title>
      <meta name="description" content="Create a Soap" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/favicon.ico" />
    </Head>
    <!-- <ToastContainer autoClose={4000} draggable={false} transition={Zoom} /> -->
    <main class="w-full max-w-md">
      <div
        class="m-6 justify-center items-center w-auto flex"
        style="
          --swv-button-background-color: transparent;
          --swv-button-hover-background-color: rgba(255, 255, 255, 0.1);
        "
      >
        <!-- <WalletMultiButtonDynamic /> -->
        <WalletMultiButton dark />
      </div>
      <form
        class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        @submit.prevent
      >
        <label class="block text-gray-700 text-sm font-bold mb-2">
          Soap Name: {{ name }}
          <input
            type="text"
            v-model="name"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </label>
        <label class="block text-gray-700 text-sm font-bold mb-2">
          Soap Description:
          <textarea
            v-model="description"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          ></textarea>
        </label>
        <label class="block text-gray-700 text-sm font-bold mb-2">
          Image:
          <input
            type="file"
            accept="image/jpeg, image/png"
            @change="handleImageChange"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </label>
        <button
          @click="submitSoapCreation"
          :disabled="!publicKey || !name || !image || loading"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-slate-400"
        >
          <svg
            v-if="loading"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            class="w-6 h-6 animate-spin"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
          <div v-else>Create Soap</div>
        </button>

        <!-- <div v-if="soap">
                                    <label class="block text-gray-700 text-sm font-bold mb-2">
                                        Soap Created. Redirecting, please wait...
                                    </label>
                                    <label class="block text-gray-700 text-sm font-bold mb-2">
                                        {soap}
                                    </label>
                                </div> -->
      </form>
    </main>
  </div>
</template>
