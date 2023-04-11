import {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  createTransferCheckedInstruction,
  getAccount,
  getAssociatedTokenAddress,
  getMint,
} from "@solana/spl-token";
import {
  isKeypairSigner,
  JsonMetadata,
  Metaplex,
  Signer,
} from "@metaplex-foundation/js";
import { memo } from "react";
import { connection, metaplex } from "~/contants";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  // Load a local keypair.
  const keypair = Keypair.fromSecretKey(
    Buffer.from(JSON.parse(config.soapKeypair))
  );

  const headers = getHeaders(event);
  const query = getQuery(event);

  console.log("\nrequest user agent: ", headers["user-agent"]);
  const soapToMint = query.soap!;
  const soapPubKey = new PublicKey(soapToMint);
  const start = Date.now();

  const soapWithoutJsonMetadata = await metaplex
    .nfts()
    .findByMint({ mintAddress: soapPubKey });
  const jsonmetadata: JsonMetadata = await (
    await fetch(soapWithoutJsonMetadata.uri, {
      method: "GET",
    })
  ).json();

  const soap = {
    ...soapWithoutJsonMetadata,
    json: jsonmetadata,
  };

  if (event.node.req.method == "GET") {
    const label = soap.json.name || "soap";
    const icon = soap.json.image || "https://imgur.com/iW0W8lK";
    return {
      label,
      icon,
    };
  }

  if (event.node.req.method == "POST") {
    const body = await readBody(event);

    let txResponse: string = "";
    // Account provided in the transaction request body by the wallet.
    const accountField = body?.account;
    if (!accountField) throw new Error("missing account");

    const toPublicKey = new PublicKey(accountField);

    console.log(
      `Solana Pay Mint: request to mint soap ${soapToMint} to ${toPublicKey.toBase58()}`
    );

    // TODO: POST to /dispense to mint soap to person
    await $fetch(`/api/dispense`, {
      method: "POST",
      body: JSON.stringify({
        toPublicKey: toPublicKey,
        soapAddress: soapToMint,
        secret: config.public.apiSecret,
      }),
    })
      .then((res) => {
        txResponse = "Mint soap";
        console.log("tx: ", res.tx);
      })
      .catch((err) => {
        if (err.response.status == 403) {
          console.log("Forbidden: Wallet already has this soap.");
          txResponse = "You already have this soap! Won't mint.";
        } else if (err.response.status == 500) {
          txResponse = "Error, please try again later";
        } else {
          console.log("error in request", err.response.data);
        }
      });

    // create an empty transaction
    // Get a recent blockhash to include in the transaction
    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash("finalized");

    const transaction = new Transaction({
      feePayer: keypair.publicKey,
      blockhash: blockhash,
      lastValidBlockHeight: lastValidBlockHeight,
      signatures: [
        // {signature: null, publicKey: keypair.publicKey},
        // {signature: null, publicKey: new PublicKey(accountField)},
      ],
    });

    const memo = Buffer.from("Mint soap", "utf-8");
    transaction.add(
      new TransactionInstruction({
        keys: [
          {
            pubkey: new PublicKey(accountField),
            isSigner: true,
            isWritable: true,
          },
          { pubkey: keypair.publicKey, isSigner: true, isWritable: true },
        ],
        data: memo,
        programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
      })
    );

    // We sign cus fee payer
    transaction.sign(keypair);

    // Serialize and return the unsigned transaction.
    const serializedTransaction = transaction.serialize({
      verifySignatures: false,
      requireAllSignatures: false,
    });

    const base64Transaction = serializedTransaction.toString("base64");
    const message = txResponse; // FIXME add soap name?

    return {
      transaction: base64Transaction,
      message,
    };
  }
});
