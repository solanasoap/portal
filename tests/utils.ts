import {
  createProgramAddressSync,
  findProgramAddressSync,
} from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { PublicKey } from "@solana/web3.js";
import { POT_TAG, USER_PROFILE_TAG } from "../lib/constants";
import * as anchor from "@project-serum/anchor";
import { SoapProgram } from "../target/types/soap_program";

const program = anchor.workspace.SoapProgram as anchor.Program<SoapProgram>;
const PROGRAM_ID = new anchor.web3.PublicKey(
  "soap4c4g3L9vQUQYSCJxhTbHdJYSiX3aZPzPGnp2CoN"
);
export const numberToU16 = (number: number) => {
  // return Buffer.from(Uint16Array.of(number));
  // return new anchor.BN(number).toArrayLike(Buffer, "le", );
  return Buffer.from([number & 0xff, (number >> 8) & 0xff]);
};

export const getUserProfile = (authority: PublicKey) => {
  return findProgramAddressSync(
    [USER_PROFILE_TAG, authority.toBuffer()],
    PROGRAM_ID
  )[0];
};

export const getPot = (mint: PublicKey, authority: PublicKey) => {
  return findProgramAddressSync(
    [POT_TAG, mint.toBuffer(), authority.toBuffer()],
    PROGRAM_ID
  )[0];
};

export const logDevnetSignature = (name: string, value) =>
  console.log(`
${name}
https://solscan.io/tx/${value}?cluster=devnet
`);

export const logDevnetAccount = (name: string, value) =>
  console.log(`
${name}
https://solscan.io/account/${value}?cluster=devnet
`);
