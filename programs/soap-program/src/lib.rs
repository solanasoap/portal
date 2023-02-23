use {crate::states::*, anchor_lang::prelude::*, instructions::*};

// pub mod errors;
pub mod constants;
pub mod instructions;
pub mod states;

declare_id!("4UMGtsE5ezGvj3nCJzg3icMuVmGkXHqmBniJHjfNaeBt");

#[program]
pub mod soap_program {
    use super::*;

    // pub fn mint_to() -> Result<()> {
    //     mint::handler(ctx);
    // }

    pub fn create(
        ctx: Context<Create>,
        soap_title: String,
        soap_symbol: String,
        soap_uri: String,
    ) -> Result<()> {
        create::handler(ctx, soap_title, soap_symbol, soap_uri)
    }

    pub fn fund_pot(ctx: Context<FundPot>, soap_count: u16, sol_lamports: u64) -> Result<()> {
        fund_pot::handler(ctx, soap_count, sol_lamports)
    }

    pub fn init_user_profile(ctx: Context<InitUserProfile>) -> Result<()> {
        init_user_profile::handler(ctx)
    }
}
