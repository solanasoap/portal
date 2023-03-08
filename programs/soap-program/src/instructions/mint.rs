use anchor_spl::{associated_token::AssociatedToken, token::TokenAccount};

use crate::{constants::POT_TAG, constants::USER_PROFILE_TAG, states::UserProfile};

use {
    anchor_lang::prelude::*,
    anchor_spl::{associated_token, token},
};

// FOR MINT TO WORK
// - One wallet initiates all mints, Pot funds rent
// - Mint given Soap to target wallet

pub fn handler(ctx: Context<MintSoap>) -> Result<()> {
    // TODO create associated token account

    associated_token::create(CpiContext::new_with_signer(
        ctx.accounts.associated_token_program.to_account_info(),
        associated_token::Create {
            payer: ctx.accounts.pot.to_account_info(),
            associated_token: ctx.accounts.associated_token_account.to_account_info(),
            authority: ctx.accounts.destination_wallet.to_account_info(),
            mint: ctx.accounts.mint_account.to_account_info(),
            system_program: ctx.accounts.system_program.to_account_info(),
            token_program: ctx.accounts.token_program.to_account_info(),
        },
        &[&[
            POT_TAG,
            ctx.accounts.mint_account.key().as_ref(),
            ctx.accounts.creator.key().as_ref(),
            &[*ctx.bumps.get("pot").unwrap()],
        ]],
    ))?;

    token::mint_to(
        CpiContext::new_with_signer(
            //new_with_signed for pda
            ctx.accounts.token_program.to_account_info(),
            token::MintTo {
                mint: ctx.accounts.mint_account.to_account_info(),
                to: ctx.accounts.associated_token_account.to_account_info(),
                authority: ctx.accounts.pot.to_account_info(),
            },
            &[&[
                POT_TAG,
                ctx.accounts.mint_account.key().as_ref(),
                ctx.accounts.creator.key().as_ref(),
                &[*ctx.bumps.get("pot").unwrap()],
            ]],
        ),
        1,
    )?;

    msg!("Soap Minted");

    Ok(())
}

#[derive(Accounts)]
// #[instruction(total_soap_count: u16, )]
pub struct MintSoap<'info> {
    #[account(mut)]
    pub mint_account: Account<'info, token::Mint>,
    #[account(mut, seeds = [
     POT_TAG,
     mint_account.key().as_ref(),
     creator.key().as_ref()
     ], bump)] // seeds = amount of total soaps count
    pub pot: SystemAccount<'info>,

    // We don't really need this but whatever
    #[account(seeds = [USER_PROFILE_TAG, creator.key().as_ref()], bump)]
    pub user_profile: Account<'info, UserProfile>,

    /// CHECK: associated token program create checks it
    #[account(mut)]
    pub associated_token_account: UncheckedAccount<'info>,

    #[account(mut)]
    pub payer: Signer<'info>,
    /// CHECK: Safe bc reasons
    #[account()]
    pub destination_wallet: AccountInfo<'info>,
    pub creator: SystemAccount<'info>,
    pub token_program: Program<'info, token::Token>,
    pub rent: Sysvar<'info, Rent>,
    pub associated_token_program: Program<'info, associated_token::AssociatedToken>,
    pub system_program: Program<'info, System>,
}

// frontend s

// Soap keypair calls MintTo
