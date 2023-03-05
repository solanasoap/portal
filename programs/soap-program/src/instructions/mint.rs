use crate::{constants::POT_TAG, states::Pot};

use {
    anchor_lang::prelude::*,
    anchor_spl::{associated_token, token},
};

// FOR MINT TO WORK
// - One wallet initiates all mints, Pot funds rent
// - Mint given Soap to target wallet

pub fn handler(ctx: Context<MintTo>) -> Result<()> {
    msg!(
        "Mint: {}",
        &ctx.accounts.mint_account.to_account_info().key()
    );
    msg!(
        "Token Address: {}",
        &ctx.accounts.associated_token_account.key()
    );
    token::mint_to(
        CpiContext::new( //new_with_signed for pda
            ctx.accounts.token_program.to_account_info(),
            token::MintTo {
                mint: ctx.accounts.mint_account.to_account_info(),
                to: ctx.accounts.associated_token_account.to_account_info(),
                authority: ctx.accounts.mint_authority.to_account_info(),
            },
        ),
        1,
    )?;

    msg!("Soap Minted");

    Ok(())
}

#[derive(Accounts)]
pub struct MintTo<'info> {
    #[account(
        mut,
        mint::decimals = 0,
        mint::authority = mint_authority.key(),
    )]
    pub mint_account: Account<'info, token::Mint>,
    // FIXME needs to be PDA - how do I get the pot PDA address here?
    #[account(mut)]
    pub mint_authority: Account<'info, Pot>,
    #[account(
        init_if_needed,
        payer = payer,
        associated_token::mint = mint_account,
        associated_token::authority = payer,
    )]
    pub associated_token_account: Account<'info, token::TokenAccount>,
    #[account(mut)]
    pub payer: Signer<'info>, 
    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, token::Token>,
    pub associated_token_program: Program<'info, associated_token::AssociatedToken>,
}

// frontend s

// Soap keypair calls MintTo
