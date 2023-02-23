use {
    crate::{constants::USER_PROFILE_TAG, states::*},
    anchor_lang::prelude::*,
};

#[derive(Accounts)]
pub struct InitUserProfile<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + UserProfile::MAX_SIZE,
        seeds = [
            USER_PROFILE_TAG,
            authority.key().as_ref(),
        ],
        bump,
    )]
    pub user_profile: Account<'info, UserProfile>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<InitUserProfile>) -> Result<()> {
    let user_profile = &mut ctx.accounts.user_profile;
    user_profile.authority = *ctx.accounts.authority.key;
    user_profile.total_soaps_count = 0;

    Ok(())
}
