use crate::{constants::POT_TAG, constants::USER_PROFILE_TAG, states::Pot, states::UserProfile};

use {
    anchor_lang::prelude::*,
    anchor_spl::{associated_token, token},
    mpl_token_metadata::*,
    // solana_sdk::program::invoke_signed,
    // solana_sdk::*,
    // spl,
    spl_associated_token_account::{id, instruction as associated_token_account_instruction},
};

// FOR MINT TO WORK
// - One wallet initiates all mints, Pot funds rent
// - Mint given Soap to target wallet

pub fn handler(ctx: Context<MintSoap>) -> Result<()> {
    msg!("Soap creator: {}", ctx.accounts.creator.key());
    //     let payer_seeds = &[
    //         b"payer",
    //         &ctx.accounts.authority.key().to_bytes()[..],
    //         &[ctx.bumps.get("payer_pda").unwrap().clone()],
    //     ];

    // //     let payer = &[&payer_seeds[..], &new_pda_seeds[..]];

    // let seeds = &[&[b"vault", payer.key.as_ref(), &[vault_bump_seed]]];

    let payer_seeds = &[
        POT_TAG,
        &(ctx.accounts.mint_authority.soap_count - 1).to_le_bytes()[..],
        &ctx.accounts.creator.key().to_bytes()[..],
    ];

    let payer = &[&payer_seeds[..]];

    if ctx.accounts.associated_token_account.lamports() > 0 {
        msg!("Creating associated token account for recipient...");
        CpiContext::new_with_signer(
            &associated_token_account_instruction::create_associated_token_account(
                &ctx.accounts.mint_authority.key(),
                &ctx.accounts.destination_wallet.key(),
                &ctx.accounts.mint_account.key(),
                &ctx.accounts.token_program.key(),
            ),
            &[
                ctx.accounts.mint_account.to_account_info(),
                ctx.accounts.associated_token_account.to_account_info(),
                ctx.accounts.destination_wallet.clone(),
                ctx.accounts.mint_authority.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
                ctx.accounts.token_program.to_account_info(),
                ctx.accounts.associated_token_program.to_account_info(),
            ],
            payer,
        )?;
    } else {
        msg!("Account exists...")
    }

    // associated_token::AssociatedToken::try_from(value)

    // token::mint_to(
    //     CpiContext::new( //new_with_signed for pda
    //         ctx.accounts.token_program.to_account_info(),
    //         token::MintTo {
    //             mint: ctx.accounts.mint_account.to_account_info(),
    //             to: ctx.accounts.associated_token_account.to_account_info(),
    //             authority: ctx.accounts.mint_authority.to_account_info(),
    //         },
    //     ),
    //     1,
    // )?;

    msg!("Soap Minted");

    Ok(())
}

#[derive(Accounts)]
// #[instruction(total_soap_count: u16, )]
pub struct MintSoap<'info> {
    #[account(
        mut,
        mint::decimals = 0,
        mint::authority = mint_authority,
    )]
    pub mint_account: Account<'info, token::Mint>,
    // FIXME needs to be PDA - how do I get the pot PDA address here?
    #[account(mut, seeds = [
     POT_TAG,
     mint_authority.soap_count.to_le_bytes().as_ref(),
     creator.key().as_ref()
     ], bump)] // seeds = amount of total soaps count
    pub mint_authority: Account<'info, Pot>,

    #[account(seeds = [USER_PROFILE_TAG, creator.key().as_ref()], bump)]
    pub user_profile: Account<'info, UserProfile>,

    /// CHECK: don't know if it's been initialized yet
    #[account(
        mut
        // init_if_needed,
        // payer = payer,
        // associated_token::mint = mint_account,
        // associated_token::authority = destination_wallet
    )]
    pub associated_token_account: UncheckedAccount<'info>,
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account()]
    pub destination_wallet: AccountInfo<'info>,

    pub creator: SystemAccount<'info>,
    pub token_program: Program<'info, token::Token>,
    pub associated_token_program: Program<'info, associated_token::AssociatedToken>,
    pub system_program: Program<'info, System>,
}

// frontend s

// Soap keypair calls MintTo
