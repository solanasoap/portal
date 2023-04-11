// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  keypairIdentity,
  Metaplex,
  KeypairSigner,
} from "@metaplex-foundation/js";
import {
  Keypair,
  Connection,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  createAssociatedTokenAccountInstruction,
  getAccount,
  createMintToInstruction,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { connection } from "~/contants";

// get params from query, to whom and which soap
// create metaplex identity with that soap's mint authority keypair
// mint one of that soap to the target address
// respond with tx signature

type soapMintRequest = {
  toPublicKey: PublicKey;
  soapAddress: PublicKey;
  dispenserName: string; // this is for guard
  amount?: number;
};

type soapObject = {
  soapAddress: PublicKey;
  mintAuthority: KeypairSigner;
};

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  // Load a local keypair.
  const keypair = Keypair.fromSecretKey(
    Buffer.from(JSON.parse(config.soapKeypair))
  );

  // Set up foundation
  const metaplex = Metaplex.make(connection).use(keypairIdentity(keypair));
  console.log(
    "Public key of keypair being used: ",
    keypair.publicKey.toBase58()
  );
  const start = Date.now();

  const body = await readBody(event);

  if (body.secret !== config.public.apiSecret) {
    throw createError({
      statusCode: 418,
      statusMessage: "Unauthorized",
    });
  }

  console.log("\nMINTING SFT\n");

  // Extract soap request details
  let soapMintDetails: soapMintRequest = body;
  const toPublicKey: PublicKey = new PublicKey(soapMintDetails.toPublicKey);
  const soapAddress: PublicKey = new PublicKey(soapMintDetails.soapAddress);

  // console.log("Sending soap " + soapAddress.toBase58() + " to " + toPublicKey.toBase58() + "\n")

  // Create keypair from metaplex identity
  const soapKeyPair = Keypair.fromSecretKey(metaplex.identity().secretKey!);

  //get associated token account address for target wallet
  const tokenATA = await getAssociatedTokenAddress(soapAddress, toPublicKey);

  // Create new transaction object
  let soapMintTransaction = new Transaction();

  try {
    console.log("Finding ATA for account: ", toPublicKey.toBase58());
    const tokenAccount = await getAccount(connection, tokenATA, "finalized");
    console.log("Token Account exists: ", tokenAccount.address.toBase58());
    // FIXME: This hardcodes to 1 soap per wallet of unique type. It's pretty effective defense, but also pretty shit
    const limitToOne = true;
    if (limitToOne) {
      console.log("Not minting, one unique soap per wallet.");
      const current = Date.now();
      console.log(`Execution time: ${current - start} ms\n`);
      throw createError({
        statusCode: 403,
        statusMessage: "Error: You already have this soap.",
      });
    }
  } catch (error) {
    console.log(
      "ATA " + tokenATA + " doesn't exist yet. Adding create to instruction."
    );
    // FIXME: Create seperate payer wallet to seperate responsibilities from BCN...
    soapMintTransaction.add(
      createAssociatedTokenAccountInstruction(
        metaplex.identity().publicKey, //Payer
        tokenATA, //Associated token account
        toPublicKey, //Token account owner
        soapAddress //Mint
      )
    );
  }

  soapMintTransaction.add(
    createMintToInstruction(
      soapAddress, //Mint
      tokenATA, //Destination Token Account
      metaplex.identity().publicKey, //Authority
      1 //number of tokens
    )
  );

  // console.log("Soap mint transaction: ", soapMintTransaction)
  const transactionId = await sendAndConfirmTransaction(
    connection,
    soapMintTransaction,
    [soapKeyPair],
    { commitment: "confirmed" }
  );

  const end = Date.now();
  console.log("Mint tx: ", transactionId);
  console.log(`Execution time: ${end - start} ms\n`);

  return {
    tx: transactionId,
  };
});