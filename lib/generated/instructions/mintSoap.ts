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
 * @category MintSoap
 * @category generated
 */
export const mintSoapStruct = new beet.BeetArgsStruct<{
  instructionDiscriminator: number[] /* size: 8 */
}>(
  [['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)]],
  'MintSoapInstructionArgs'
)
/**
 * Accounts required by the _mintSoap_ instruction
 *
 * @property [_writable_] mintAccount
 * @property [_writable_] pot
 * @property [_writable_] associatedTokenAccount
 * @property [_writable_, **signer**] payer
 * @property [] destinationWallet
 * @property [] creator
 * @property [] associatedTokenProgram
 * @category Instructions
 * @category MintSoap
 * @category generated
 */
export type MintSoapInstructionAccounts = {
  mintAccount: web3.PublicKey
  pot: web3.PublicKey
  associatedTokenAccount: web3.PublicKey
  payer: web3.PublicKey
  destinationWallet: web3.PublicKey
  creator: web3.PublicKey
  tokenProgram?: web3.PublicKey
  rent?: web3.PublicKey
  associatedTokenProgram: web3.PublicKey
  systemProgram?: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const mintSoapInstructionDiscriminator = [
  131, 147, 40, 207, 133, 90, 173, 134,
]

/**
 * Creates a _MintSoap_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category MintSoap
 * @category generated
 */
export function createMintSoapInstruction(
  accounts: MintSoapInstructionAccounts,
  programId = new web3.PublicKey('soap4c4g3L9vQUQYSCJxhTbHdJYSiX3aZPzPGnp2CoN')
) {
  const [data] = mintSoapStruct.serialize({
    instructionDiscriminator: mintSoapInstructionDiscriminator,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.mintAccount,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.pot,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.associatedTokenAccount,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.payer,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: accounts.destinationWallet,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.creator,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.tokenProgram ?? splToken.TOKEN_PROGRAM_ID,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.rent ?? web3.SYSVAR_RENT_PUBKEY,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.associatedTokenProgram,
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
