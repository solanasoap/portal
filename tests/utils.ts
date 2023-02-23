import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { PublicKey } from "@solana/web3.js";
import { POT_TAG, USER_PROFILE_TAG } from "./constants";
import * as anchor from "@project-serum/anchor";
import { SoapProgram } from "../target/types/soap_program";

const program = anchor.workspace.SoapProgram as anchor.Program<SoapProgram>;

export const numberToU16 = (number: number) => {
  // return Buffer.from(Uint16Array.of(number));
  // return new anchor.BN(number).toArrayLike(Buffer, "le", );
  return Buffer.from([number & 0xff, (number >> 8) & 0xff]);
};

export const getUserProfile = (authority: PublicKey) => {
  return findProgramAddressSync(
    [USER_PROFILE_TAG, authority.toBuffer()],
    program.programId
  )[0];
};

export const getPot = (authority: PublicKey, soap_count: number) => {
  return findProgramAddressSync(
    [POT_TAG, numberToU16(soap_count), authority.toBuffer()],
    program.programId
  )[0];
};
