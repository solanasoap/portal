use anchor_lang::prelude::*;
use anchor_lang::solana_program::sysvar;
use anchor_spl::token::Token;
use anchor_spl::token::{self, Mint, TokenAccount};
use std::str::FromStr;
use anchor_lang::solana_program::{program::invoke, system_instruction};
use mpl_token_metadata::instruction as mpl_instruction;

pub mod instructions;

use instructions::*;

declare_id!("6yf7B7cg2Ge8aeJQHa7YYfufDFQh9dvnvxT2wnuviRUN");

#[program]
pub mod soap_program {
    use super::*;

    pub fn create_soap(
        ctx: Context<Create>, 
        soap_title: String, // Comes from creator, unique for each soap
        soap_symbol: String, // Always "SOAP"
        soap_uri: String, // Shadow Drive, unique for each soap
    ) -> Result<()> {

        create::create(
            ctx, 
            soap_title, 
            soap_symbol, 
            soap_uri,
            0,
        )
    }

    pub fn mint_to(
        ctx: Context<MintTo>, 
        quantity: u64,
    ) -> Result<()> {

        mint::mint_to(
            ctx, 
            quantity,
        )
    }

}



