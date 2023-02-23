import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { SoapProgram } from "../target/types/soap_program";
import { PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import { getPot, getUserProfile } from "./utils";

describe("soap-program", () => {
  const provider = anchor.AnchorProvider.env();

  anchor.setProvider(provider);
  const payer = provider.wallet as anchor.Wallet;
  const program = anchor.workspace.SoapProgram as Program<SoapProgram>;

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
    const userProfileData = await program.account.userProfile.fetch(
      userProfile
    );
    console.log(userProfileData);
  });

  // it("Create a Soap!", async () => {
  //   const mintKeypair: anchor.web3.Keypair = anchor.web3.Keypair.generate();

  //   const metadataAddress = anchor.web3.PublicKey.findProgramAddressSync(
  //     [
  //       Buffer.from("metadata"),
  //       TOKEN_METADATA_PROGRAM_ID.toBuffer(),
  //       mintKeypair.publicKey.toBuffer(),
  //     ],
  //     TOKEN_METADATA_PROGRAM_ID
  //   )[0];
  //   console.log("metadataAddress", metadataAddress.toBase58());

  //   const userProfile = getUserProfile(payer.publicKey);
  //   console.log("userProfile", userProfile.toBase58());
  //   const pot = getPot(payer.publicKey, 0);

  //   try {
  //     const tx = await program.methods
  //       .create(tokenTitle, tokenSymbol, tokenUri)
  //       .accounts({
  //         pot: pot,
  //         userProfile: userProfile,
  //         metadataAccount: metadataAddress,
  //         mintAccount: mintKeypair.publicKey,
  //         mintAuthority: payer.publicKey,
  //         payer: payer.publicKey,
  //         rent: anchor.web3.SYSVAR_RENT_PUBKEY,
  //         systemProgram: anchor.web3.SystemProgram.programId,
  //         tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
  //       })
  //       .signers([mintKeypair, payer.payer])
  //       .rpc();
  //     console.log("Success!");
  //     console.log(`   Mint Address: ${mintKeypair.publicKey}`);
  //     console.log(`   Tx Signature: ${tx}`);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // });
});
