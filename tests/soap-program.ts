import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { SoapProgram } from "../target/types/soap_program";
import { PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import { getPot, getUserProfile } from "./utils";
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { findMetadataPda } from "@metaplex-foundation/js";

const PROGRAM_ID = new anchor.web3.PublicKey(
  "oJCUBLbGJUUjZcuKVyjLmhLUo6zpkdDFvt2UCR3HWru"
);

describe("soap-program", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  // const program = anchor.workspace.SoapProgram as Program<SoapProgram>;
  const program = new anchor.Program<SoapProgram>(
    require("../target/idl/soap_program.json"),
    PROGRAM_ID,
    provider
  );
  const payer = provider.wallet as anchor.Wallet;

  console.log("GETPOT 1", getPot(payer.publicKey, 1));
  console.log("GETPOT 2", getPot(payer.publicKey, 2).toBase58());

  const tokenTitle = "Soap Program";
  const tokenSymbol = "SOAP";
  const tokenUri =
    "https://raw.githubusercontent.com/solana-developers/program-examples/new-examples/tokens/tokens/.assets/spl-token.json";

  it("Initialize User Profile", async () => {
    const userProfile = getUserProfile(payer.publicKey);
    console.log("userProfile", userProfile.toBase58());

    const tx = await program.methods
      .initUserProfile()
      .accounts({
        userProfile: userProfile,
        authority: payer.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([payer.payer])
      .rpc();

    console.log("Tx Signature: ", tx);
  });

  it("Create a Soap!", async () => {
    const mintKeypair: anchor.web3.Keypair = anchor.web3.Keypair.generate();

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
    const userProfile = getUserProfile(payer.publicKey);
    console.log(
      "count HERE",
      (await program.account.userProfile.fetch(userProfile)).totalSoapsCount
    );
    const userProfileData = await program.account.userProfile.fetch(
      userProfile
    );
    const pot = getPot(payer.publicKey, userProfileData.totalSoapsCount);

    const tx = await program.methods
      .create(tokenTitle, tokenSymbol, tokenUri)
      .accounts({
        pot: pot,
        userProfile: userProfile,
        metadataAccount: metadataAddress,
        mintAccount: mintKeypair.publicKey,
        payer: payer.publicKey,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
        metadataProgram: TOKEN_METADATA_PROGRAM_ID,
      })
      .signers([mintKeypair, payer.payer])
      .rpc();

    console.log(`Mint Address: ${mintKeypair.publicKey}`);
    console.log(`Tx Signature: ${tx}`);
  });

  it("Fund the Pot", async () => {
    const userProfile = getUserProfile(payer.publicKey);
    const userProfileData = await program.account.userProfile.fetch(
      userProfile
    );
    const soapCount = userProfileData.totalSoapsCount - 1;

    const pot = getPot(payer.publicKey, soapCount);

    const tx = await program.methods
      .fundPot(soapCount, new anchor.BN(LAMPORTS_PER_SOL * 0.1))
      .accounts({
        authority: payer.publicKey,
        pot: pot,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([payer.payer])
      .rpc();

    console.log("Tx Signature: ", tx);
  });

  it("Withdraw from the Pot", async () => {
    const userProfile = getUserProfile(payer.publicKey);
    const userProfileData = await program.account.userProfile.fetch(
      userProfile
    );
    const soapCount = userProfileData.totalSoapsCount - 1;

    const pot = getPot(payer.publicKey, soapCount);
    try {
      const tx = await program.methods
        .withdrawPot(soapCount, new anchor.BN(LAMPORTS_PER_SOL * 0.1))
        .accounts({
          authority: payer.publicKey,
          pot: pot,
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
