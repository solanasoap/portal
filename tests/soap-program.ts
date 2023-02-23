import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { SoapProgram } from "../target/types/soap_program";
import {
  PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID
} from '@metaplex-foundation/mpl-token-metadata';
import { getPot, getUserProfile } from "./utils";


describe("soap-program", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const payer = provider.wallet as anchor.Wallet;
  const program = anchor.workspace.SoapProgram as Program<SoapProgram>;

  const tokenTitle = "Soap Program";
  const tokenSymbol = "SOAP";
  const tokenUri = "https://raw.githubusercontent.com/solana-developers/program-examples/new-examples/tokens/tokens/.assets/spl-token.json";

  it("Create a Soap!", async () => {

    const mintKeypair: anchor.web3.Keypair = anchor.web3.Keypair.generate();

    const metadataAddress = (anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mintKeypair.publicKey.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    ))[0];

    const pot = getPot(provider.publicKey, 0);
    const userProfile = getUserProfile(provider.publicKey);

    const tx = await program.methods.createSoap(tokenTitle, tokenSymbol, tokenUri)
      .accounts({
        pot: pot,
        userProfile: userProfile,
        metadataAccount: metadataAddress,
        mintAccount: mintKeypair.publicKey,
        mintAuthority: payer.publicKey,
        payer: payer.publicKey,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
      })
      .signers([mintKeypair, payer.payer])
      .rpc();

    console.log("Success!");
    console.log(`   Mint Address: ${mintKeypair.publicKey}`);
    console.log(`   Tx Signature: ${tx}`);
  });
});
