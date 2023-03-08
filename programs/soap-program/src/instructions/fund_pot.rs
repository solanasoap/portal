use anchor_spl::token;

use {
    crate::constants::POT_TAG,
    anchor_lang::{
        prelude::*,
        system_program::{transfer, Transfer},
    },
};

#[derive(Accounts)]
#[instruction(soap_count: u16)]
pub struct FundPot<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [
            POT_TAG,
            mint_account.key().as_ref(), // Soap pubkey
            authority.key().as_ref(), // Soap Creator pubkey
        ],
        bump,
    )]
    pub pot: SystemAccount<'info>,

    pub mint_account: Account<'info, token::Mint>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<FundPot>, soap_count: u16, sol_lamports: u64) -> Result<()> {
    let cpi_program = ctx.accounts.system_program.to_account_info();
    let cpi_accounts = Transfer {
        from: ctx.accounts.authority.to_account_info(),
        to: ctx.accounts.pot.to_account_info(),
    };
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

    // Sends SOL to pot from authority
    transfer(cpi_ctx, sol_lamports)?;

    Ok(())
}
