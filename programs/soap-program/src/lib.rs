use {anchor_lang::prelude::*, instructions::*};

// pub mod errors;
pub mod constants;
pub mod errors;
pub mod instructions;
pub mod states;

declare_id!("4ytc1xagmoutbU1ppmEPMUuFFM7Eso3c2ZRk4nBrkGYq");

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

    pub fn init_user_profile(ctx: Context<InitUserProfile>) -> Result<()> {
        init_user_profile::handler(ctx)
    }

    pub fn fund_pot(ctx: Context<FundPot>, soap_count: u16, sol_lamports: u64) -> Result<()> {
        fund_pot::handler(ctx, soap_count, sol_lamports)
    }

    pub fn withdraw_pot(
        ctx: Context<WithdrawPot>,
        soap_count: u16,
        sol_lamports: u64,
    ) -> Result<()> {
        withdraw_pot::handler(ctx, soap_count, sol_lamports)
    }

    pub fn mint_soap(ctx: Context<MintSoap>) -> Result<()> {
        mint::handler(ctx)
    }
}
