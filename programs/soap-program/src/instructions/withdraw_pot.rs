use {
    crate::{constants::POT_TAG, errors::ErrorCode, states::Pot},
    anchor_lang::prelude::*,
};

#[derive(Accounts)]
#[instruction(soap_count: u16)]
pub struct WithdrawPot<'info> {
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

pub fn handler(ctx: Context<WithdrawPot>, soap_count: u16, sol_lamports: u64) -> Result<()> {
    let pot_account_info: &mut AccountInfo = &mut ctx.accounts.pot.to_account_info();
    let authority_account_info: &mut AccountInfo = &mut ctx.accounts.authority.to_account_info();

    if **pot_account_info.try_borrow_lamports()? < sol_lamports {
        return Err(ErrorCode::InsufficientFundsForTransaction.into());
    }

    **pot_account_info.try_borrow_mut_lamports()? -= sol_lamports;
    **authority_account_info.try_borrow_mut_lamports()? += sol_lamports;

    Ok(())
}
