import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { SoapProgram } from "../target/types/soap_program";
import { PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import {
  getPot,
  getUserProfile,
  logDevnetAccount,
  logDevnetSignature,
} from "./utils";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  PublicKey,
  findMetadataPda,
  Metaplex,
  Pda,
} from "@metaplex-foundation/js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import { POT_TAG } from "../lib/constants";

const PROGRAM_ID = new anchor.web3.PublicKey(
  "soap4c4g3L9vQUQYSCJxhTbHdJYSiX3aZPzPGnp2CoN"
);

const destinationWallet = Keypair.generate().publicKey;

describe("soap-program", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  let latestSoap;

  // const program = anchor.workspace.SoapProgram as Program<SoapProgram>;
  const program = new anchor.Program<SoapProgram>(
    require("../target/idl/soap_program.json"),
    PROGRAM_ID,
    provider
  );
  const payer = provider.wallet as anchor.Wallet;
  const mintKeypair: anchor.web3.Keypair = anchor.web3.Keypair.generate();
  const pot = Pda.find(PROGRAM_ID, [
    POT_TAG,
    mintKeypair.publicKey.toBuffer(),
    payer.publicKey.toBuffer(),
  ]);

  console.log(
    "Pot Address",
    getPot(mintKeypair.publicKey, payer.publicKey).toBase58()
  );

  const tokenTitle = "Soap Program";
  const tokenSymbol = "SOAP";
  const tokenUri =
    "https://raw.githubusercontent.com/solana-developers/program-examples/new-examples/tokens/tokens/.assets/spl-token.json";

  it("Create a Soap!", async () => {
    console.log("\n\n\n WE CREATING A SOAP HERE EYYY");

    const metadataAddress = findMetadataPda(
      mintKeypair.publicKey,
      TOKEN_METADATA_PROGRAM_ID
    );

    // anchor.web3.PublicKey.findProgramAddressSync(
    //   [
    //     Buffer.from("metadata"),
    //     TOKEN_METADATA_PROGRAM_ID.toBuffer(),
    //     mintKeypair.publicKey.toBuffer(),
    //   ],
    //   TOKEN_METADATA_PROGRAM_ID
    // )[0];
    // const userProfile = getUserProfile(payer.publicKey);
    // console.log(
    //   "count HERE",
    //   (await program.account.userProfile.fetch(userProfile)).totalSoapsCount
    // );
    // const userProfileData = await program.account.userProfile.fetch(
    //   userProfile
    // );

    const tx = await program.methods
      .create(tokenTitle, tokenSymbol, tokenUri)
      .accounts({
        // userProfile: userProfile,
        metadataAccount: metadataAddress,
        mintAccount: mintKeypair.publicKey,
        payer: payer.publicKey,
        pot,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
        metadataProgram: TOKEN_METADATA_PROGRAM_ID,
      })
      .signers([mintKeypair, payer.payer])
      .rpc()
      .catch(console.log);

    console.log(`Mint Address: ${mintKeypair.publicKey}`);
    console.log(`Tx Signature: ${tx}`);
  });

  it("Fund the Pot", async () => {
    console.log("\n\n\n WE FUND POT HERE EYYY");

    const tx = await program.methods
      .fundPot(new anchor.BN(LAMPORTS_PER_SOL * 0.2))
      .accounts({
        authority: payer.publicKey,
        mintAccount: mintKeypair.publicKey,
        pot,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([payer.payer])
      .rpc();

    console.log("Tx Signature: ", tx);
  });

  it("Mint to end user wallet", async () => {
    try {
      const tokenMetadata = await Metaplex.make(provider.connection)
        .nfts()
        .findByMint({ mintAddress: mintKeypair.publicKey });

      const userAta = getAssociatedTokenAddressSync(
        mintKeypair.publicKey,
        destinationWallet
      );

      logDevnetAccount("User ATA", userAta);
      logDevnetAccount("Pot Address", pot);
      logDevnetAccount("Destination Wallet", destinationWallet);
      logDevnetAccount("Soap Mint", mintKeypair.publicKey);

      const tx = await program.methods
        .mintSoap()
        .accounts({
          mintAccount: mintKeypair.publicKey,
          pot,
          associatedTokenAccount: userAta,
          payer: provider.wallet.publicKey,
          destinationWallet: destinationWallet,
          creator: provider.wallet.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([payer.payer])
        .rpc()
        .catch(console.log);
      logDevnetSignature("Mint: ", tx);
    } catch (e) {
      console.log("ERROR", e);
    }
  });

  it("Withdraw from the Pot", async () => {
    console.log("\n\n\n WE WITHDRAW FROM POT HERE EYYY");

    try {
      const tx = await program.methods
        .withdrawPot(new anchor.BN(LAMPORTS_PER_SOL * 0.1))
        .accounts({
          authority: payer.publicKey,
          pot,
          mintAccount: mintKeypair.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([payer.payer])
        .rpc();
      console.log("Tx Signature: ", tx);
    } catch (e) {
      console.log("ERROR", e);
    }
  });
});
