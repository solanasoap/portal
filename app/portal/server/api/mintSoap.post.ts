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
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  MintSoapInstructionAccounts,
  PROGRAM_ID,
  createMintSoapInstruction,
} from "../../../../lib/generated";
import { connection } from "~/contants";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();
  // Load a local keypair.
  const keypair = Keypair.fromSecretKey(
    Buffer.from(JSON.parse(config.soapKeypair))
  );

  const metaplex = Metaplex.make(connection).use(keypairIdentity(keypair));
  console.log(
    "Public key of keypair being used: ",
    keypair.publicKey.toBase58()
  );

  const start = Date.now();

  if (body.secret !== config.public.apiSecret) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
    });
  }

  console.log("\n\nMinting Soap\n");

  // Extract soap request details
  let soapMintDetails: soapMintRequest = body;
  const toPublicKey: PublicKey = new PublicKey(soapMintDetails.toPublicKey);
  const soapAddress: PublicKey = new PublicKey(soapMintDetails.soapAddress);

  // console.log("Sending soap " + soapAddress.toBase58() + " to " + toPublicKey.toBase58() + "\n")

  // Create keypair from metaplex identity
  const soapKeyPair = Keypair.fromSecretKey(metaplex.identity().secretKey!);

  //get associated token account address for target wallet
  const tokenATA = await getAssociatedTokenAddress(soapAddress, toPublicKey);

  // My God need much better error handling here. Eg. if Pot Empty, user already has soap etc.
  const tokenAccountBalance = await connection.getBalance(tokenATA).catch();
  if (tokenAccountBalance == 0) {
    console.log("Token acc doesn't exist for user, continuing.");
  }
  if (tokenAccountBalance != 0) {
    console.log("Token Account exists: ");
    console.log("Not minting, one unique soap per wallet.");
    throw createError({
      statusCode: 418,
      statusMessage: "You already got this soap, one per wallet.",
    });
  }

  const soap = await metaplex.nfts().findByMint({ mintAddress: soapAddress });
  const potBalance = await connection.getBalance(
    soap.mint.mintAuthorityAddress!
  );

  const soapDetails: soapDetails = {
    Address: soapAddress,
    UpdateAuthority: soap.updateAuthorityAddress,
    PotAddress: soap.mint.mintAuthorityAddress!,
    PotBalance: potBalance,
  };

  console.log("Soap details: ", soapDetails);

  const mintSoapIxAccs: MintSoapInstructionAccounts = {
    mintAccount: soapDetails.Address,
    pot: soapDetails.PotAddress,
    associatedTokenAccount: tokenATA,
    payer: metaplex.identity().publicKey,
    destinationWallet: toPublicKey,
    creator: soapDetails.UpdateAuthority,
    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
  };

  const mintSoapIx = createMintSoapInstruction(mintSoapIxAccs, PROGRAM_ID);

  // Create new transaction object
  let soapMintTransaction = new Transaction();
  soapMintTransaction.add(mintSoapIx);

  const transactionId = await sendAndConfirmTransaction(
    connection,
    soapMintTransaction,
    [soapKeyPair],
    { commitment: "confirmed" }
  ).catch((e) => {
    console.log("Error in MintSoap: ", e);
    throw createError({
      statusCode: 403,
      statusMessage: "Failed to mint. Try again.",
    });
  });

  const end = Date.now();
  console.log("Mint tx: ", transactionId);
  console.log(`Execution time: ${end - start} ms\n`);

  return {
    status: 200,
    data: transactionId,
  };
});

type soapMintRequest = {
  toPublicKey: PublicKey;
  soapAddress: PublicKey;
  dispenserName: string; // DEPRECATED this is for guard
  amount?: number;
};

// This should really be in my lib types, as it's used at multiple places
type soapDetails = {
  Address: PublicKey;
  UpdateAuthority: PublicKey;
  PotAddress: PublicKey;
  PotBalance: number;
};
