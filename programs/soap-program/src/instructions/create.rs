use std::str::FromStr;

use crate::states::{UserProfile, Pot};

use {
    crate::{constants::{POT_TAG,USER_PROFILE_TAG}},
    anchor_lang::{prelude::*, solana_program::program::invoke},
    anchor_spl::token,
    mpl_token_metadata::{instruction as mpl_instruction,state::{Creator, Collection}},
};

// The macros within the Account Context will create our
//      Mint account and initialize it as a Mint
//      We just have to do the metadata
//
#[derive(Accounts)]
#[instruction(
    soap_title: String, 
    soap_symbol: String, 
    soap_uri: String,
)]
pub struct Create<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        init_if_needed,
        payer = payer,
        space = 8 + UserProfile::MAX_SIZE,
        seeds = [
            USER_PROFILE_TAG,
            payer.key().as_ref(),
        ],
        bump,
    )]
    pub user_profile: Account<'info, UserProfile>,    
    
    #[account(
        init,
        payer = payer,
        space = 8 + Pot::MAX_SIZE,
        seeds = [
            POT_TAG,
            user_profile.total_soaps_count.to_le_bytes().as_ref(),
            payer.key().as_ref(),
        ],
        bump,
    )]
    pub pot: Account<'info, Pot>,

    #[account(
        init,
        payer = payer,
        mint::decimals = 0,
        mint::authority = mint_authority.key(),
    )]
    pub mint_account: Account<'info, token::Mint>,
    
    /// CHECK: We're about to create this with Metaplex
    #[account(mut)]
    pub metadata_account: UncheckedAccount<'info>,

    pub mint_authority: SystemAccount<'info>,    

    pub rent: Sysvar<'info, Rent>,

    pub token_program: Program<'info, token::Token>,
    pub system_program: Program<'info, System>,
}

// pda needs to be the mint_authority for the soap
// [payer]

pub fn create(
    ctx: Context<Create>,
    soap_title: String,
    soap_symbol: String,
    soap_uri: String,
) -> Result<()> {
    msg!("Creating metadata account...");
    msg!(
        "Metadata account address: {}",
        &ctx.accounts.metadata_account.key()
    );
    invoke(
        &mpl_instruction::create_metadata_accounts_v3(
            mpl_token_metadata::ID, 
            ctx.accounts.metadata_account.key(),
            ctx.accounts.mint_account.key(),           
            ctx.accounts.pot.key(), // Has to be the Pot
            ctx.accounts.payer.key(),
            ctx.accounts.payer.key(),
            soap_title,                               
            soap_symbol,                              
            soap_uri,                                 
           Some( vec![
                Creator {
                    address: ctx.accounts.payer.key(),
                    verified: true,
                    share: 100,
                }
            ]),
            10000,                                     
            true,                                      
            true,                                      
            Some(
                Collection{
                    key: Pubkey::from_str("9McAofPndtizYttpcdPD4EnQniJZdCG7o6usF2d4JPDV").unwrap(),
                    verified: true,
                }
            ),                                      
            None,                                      
           None,
        ),
        &[
            ctx.accounts.metadata_account.to_account_info(),
            ctx.accounts.mint_account.to_account_info(),
            ctx.accounts.mint_authority.to_account_info(),
            ctx.accounts.payer.to_account_info(),
            ctx.accounts.mint_authority.to_account_info(),
            ctx.accounts.rent.to_account_info(),
        ],
    )?;

    msg!("Token mint created successfully.");

    let user_profile = &mut ctx.accounts.user_profile;
    let pot = &mut ctx.accounts.pot;

    user_profile.authority = ctx.accounts.payer.key();
    
    pot.soap_addres =  ctx.accounts.mint_account.key();
    pot.soap_count = user_profile.total_soaps_count;
    
    user_profile.total_soaps_count +=1 ;

    Ok(())
}
