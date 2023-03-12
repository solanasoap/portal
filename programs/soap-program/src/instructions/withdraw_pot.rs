use anchor_lang::system_program::{transfer, Transfer};
use anchor_spl::token;

use {
    crate::{constants::POT_TAG, errors::ErrorCode},
    anchor_lang::prelude::*,
};

#[derive(Accounts)]
#[instruction(soap_count: u16)]
pub struct WithdrawPot<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(mut, seeds = [
        POT_TAG,
        mint_account.key().as_ref(),
        authority.key().as_ref()
        ], bump)]
    pub pot: SystemAccount<'info>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub mint_account: Account<'info, token::Mint>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<WithdrawPot>, sol_lamports: u64) -> Result<()> {
    let cpi_program = ctx.accounts.system_program.to_account_info();
    let cpi_accounts = Transfer {
        to: ctx.accounts.authority.to_account_info(),
        from: ctx.accounts.pot.to_account_info(),
    };

    // Sends SOL from pot to authority
    transfer(
        CpiContext::new_with_signer(
            cpi_program,
            cpi_accounts,
            &[&[
                POT_TAG,
                ctx.accounts.mint_account.key().as_ref(),
                ctx.accounts.payer.key().as_ref(),
                &[*ctx.bumps.get("pot").unwrap()],
            ]],
        ),
        sol_lamports,
    )?;

    Ok(())
}
