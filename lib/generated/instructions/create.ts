/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as splToken from '@solana/spl-token'
import * as beet from '@metaplex-foundation/beet'
import * as web3 from '@solana/web3.js'

/**
 * @category Instructions
 * @category Create
 * @category generated
 */
export type CreateInstructionArgs = {
  soapTitle: string
  soapSymbol: string
  soapUri: string
}
/**
 * @category Instructions
 * @category Create
 * @category generated
 */
export const createStruct = new beet.FixableBeetArgsStruct<
  CreateInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['soapTitle', beet.utf8String],
    ['soapSymbol', beet.utf8String],
    ['soapUri', beet.utf8String],
  ],
  'CreateInstructionArgs'
)
/**
 * Accounts required by the _create_ instruction
 *
 * @property [_writable_, **signer**] payer
 * @property [] pot
 * @property [_writable_, **signer**] mintAccount
 * @property [_writable_] metadataAccount
 * @property [] metadataProgram
 * @category Instructions
 * @category Create
 * @category generated
 */
export type CreateInstructionAccounts = {
  payer: web3.PublicKey
  pot: web3.PublicKey
  mintAccount: web3.PublicKey
  metadataAccount: web3.PublicKey
  rent?: web3.PublicKey
  metadataProgram: web3.PublicKey
  tokenProgram?: web3.PublicKey
  systemProgram?: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const createInstructionDiscriminator = [24, 30, 200, 40, 5, 28, 7, 119]

/**
 * Creates a _Create_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category Create
 * @category generated
 */
export function createCreateInstruction(
  accounts: CreateInstructionAccounts,
  args: CreateInstructionArgs,
  programId = new web3.PublicKey('soap4c4g3L9vQUQYSCJxhTbHdJYSiX3aZPzPGnp2CoN')
) {
  const [data] = createStruct.serialize({
    instructionDiscriminator: createInstructionDiscriminator,
    ...args,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.payer,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: accounts.pot,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.mintAccount,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: accounts.metadataAccount,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.rent ?? web3.SYSVAR_RENT_PUBKEY,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.metadataProgram,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.tokenProgram ?? splToken.TOKEN_PROGRAM_ID,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.systemProgram ?? web3.SystemProgram.programId,
      isWritable: false,
      isSigner: false,
    },
  ]

  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc)
    }
  }

  const ix = new web3.TransactionInstruction({
    programId,
    keys,
    data,
  })
  return ix
}