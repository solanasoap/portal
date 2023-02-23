use anchor_lang::prelude::*;

pub mod constants;
pub mod instructions;
pub mod states;

use instructions::*;

declare_id!("6yf7B7cg2Ge8aeJQHa7YYfufDFQh9dvnvxT2wnuviRUN");

#[program]
pub mod soap_program {
    use super::*;

    pub fn mint_to() -> Result<()> {
        instructions::mint_to(ctx);
    }

    pub fn create_soap(
        ctx: Context<Create>,
        soap_title: String,
        soap_symbol: String,
        soap_uri: String,
    ) -> Result<()> {
        instructions::create(ctx, soap_title, soap_symbol, soap_uri)
    }

    pub fn fund_pot(ctx: Context<FundPot>, soap_count: u8, sol_lamports: u64) -> Result<()> {
        instructions::fund_pot(ctx, soap_count, sol_lamports)
    }
}
