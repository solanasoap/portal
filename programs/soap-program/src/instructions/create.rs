use mpl_token_metadata::state::{Creator, Collection};

use {
    crate::{constants::{POT_TAG}},
    anchor_lang::{prelude::*, solana_program::program::invoke_signed},
    anchor_spl::token,
    mpl_token_metadata::{instruction as mpl_instruction },
};

#[derive(Accounts)]
#[instruction(
    soap_title: String, 
    soap_symbol: String, // FIXME THIS SHOULD BE HARDCODED
    soap_uri: String,
)]
pub struct Create<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    // #[account(
    //     mut,
    //     seeds = [
    //         USER_PROFILE_TAG,
    //         payer.key().as_ref(),
    //     ],
    //     bump,
    // )]
    // pub user_profile: Account<'info, UserProfile>,
    
    #[account(
        seeds = [
            POT_TAG,
            mint_account.key().as_ref(), // Soap pubkey
            payer.key().as_ref(), // Soap Creator pubkey
        ],
        bump,
    )]
    pub pot: SystemAccount<'info>,

    #[account(
        init,
        payer = payer,
        mint::decimals = 0,
        mint::authority = pot.key(),
    )]
    pub mint_account: Account<'info, token::Mint>,
    
    /// CHECK: We're about to create this with Metaplex
    #[account(mut)]
    pub metadata_account: UncheckedAccount<'info>,

    pub rent: Sysvar<'info, Rent>,

    /// CHECK: This is not dangerous because we don't read or write from this account
    pub metadata_program: AccountInfo<'info>,
    pub token_program: Program<'info, token::Token>,
    pub system_program: Program<'info, System>,
}

// pda needs to be the mint_authority for the soap
// [payer]

pub fn handler(
    ctx: Context<Create>,
    soap_title: String,
    soap_symbol: String,
    soap_uri: String,
) -> Result<()> {
    // let user_profile = &mut ctx.accounts.user_profile;
    let pot = &mut ctx.accounts.pot;

    let payer_binding = ctx.accounts.payer.key();
    let mint_binding = ctx.accounts.mint_account.key();
    let pot_seeds = &[
        POT_TAG,
        mint_binding.as_ref(),
        payer_binding.as_ref(),
        &[*ctx.bumps.get("pot").unwrap()],
    ];


    invoke_signed(
        &mpl_instruction::create_metadata_accounts_v3(
            mpl_token_metadata::id(), 
            ctx.accounts.metadata_account.key(),
            ctx.accounts.mint_account.key(),           
            pot.key(),
            ctx.accounts.payer.key(),
            ctx.accounts.payer.key(),
            soap_title,                               
            soap_symbol,  // FIXME THIS SHOULD BE HARDCODED                            
            soap_uri,                                             
            // None,
            Some(vec![
                Creator {
                    address: ctx.accounts.payer.key(),
                    verified: true,
                    share: 100,
                }
            ]),
            10000,                                     
            false,                                      
            true,       
            // FIXME The collection NFT's authority is BCN... keypair. Metaplex program won't be able to verify it because it's authority is not the program.
            // TODO: Create PDA that owns the collection NFT and sign each create tx with that as well                               
            // Some(
            //     Collection{
            //         key: Pubkey::from_str("9McAofPndtizYttpcdPD4EnQniJZdCG7o6usF2d4JPDV").unwrap(),
            //         verified: true,
            //     }
            // ),  
            None,    // Collection above                          
            None,                                      
            None,
        ),
        &[
            ctx.accounts.metadata_program.to_account_info().clone(), 
            ctx.accounts.metadata_account.to_account_info(),
            ctx.accounts.mint_account.to_account_info(),
            pot.to_account_info(),
            ctx.accounts.payer.to_account_info(),
            pot.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
            ctx.accounts.rent.to_account_info(),
            ],
            &[pot_seeds],
    )?;

    msg!("Soap created");

    // user_profile.total_soaps_count +=1;

    Ok(())
}
