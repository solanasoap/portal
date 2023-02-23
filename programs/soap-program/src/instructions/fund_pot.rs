use {
    crate::{
        constants::POT_TAG,
        states::Pot,
    },
    anchor_lang::{prelude::*,system_program::{Transfer, transfer}},
};

#[derive(Accounts)]
#[instruction(soap_count: u8)]
pub struct FundPot<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [
            POT_TAG,
            soap_count.to_le_bytes().as_ref(),
            authority.key().as_ref(),
        ],
        bump,
    )]
    pub pot: Account<'info, Pot>,

    pub system_program: Program<'info, System>,
}

pub fn fund_pot(ctx: Context<FundPot>, soap_count: u8,sol_lamports: u64) -> Result<()> {
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
