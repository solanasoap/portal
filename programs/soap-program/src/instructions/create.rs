use {
    anchor_lang::{prelude::*, solana_program::program::invoke},
    anchor_spl::token,
    mpl_token_metadata::instruction as mpl_instruction,
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
    token_decimals: u8,
)]

pub struct Create<'info> {
    /// CHECK: We're about to create this with Metaplex
    #[account(mut)]
    pub metadata_account: UncheckedAccount<'info>,
    #[account(
        init,
        payer = payer,
        mint::decimals = token_decimals,
        mint::authority = mint_authority.key(),
    )]
    pub mint_account: Account<'info, token::Mint>,
    pub mint_authority: SystemAccount<'info>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, token::Token>,
    /// CHECK: Metaplex will check this
    pub token_metadata_program: UncheckedAccount<'info>,
}

pub fn create(
    ctx: Context<Create>,
    soap_title: String,
    soap_symbol: String,
    soap_uri: String,
    _token_decimals: u8,
) -> Result<()> {
    msg!("Creating metadata account...");
    msg!(
        "Metadata account address: {}",
        &ctx.accounts.metadata_account.key()
    );
    invoke(
        &mpl_instruction::create_metadata_accounts_v3(
            ctx.accounts.token_metadata_program.key(), // Program ID (the Token Metadata Program)
            ctx.accounts.metadata_account.key(),       // Metadata account
            ctx.accounts.mint_account.key(),           // Mint account
            ctx.accounts.mint_authority.key(),         // Mint authority
            ctx.accounts.payer.key(),                  // Payer
            ctx.accounts.mint_authority.key(),         // Update authority
            soap_title,                               // Name
            soap_symbol,                              // Symbol
            soap_uri,                                 // URI
            None,                                      // Creators FIXME
            10000,                                     // Seller fee basis points
            true,                                      // Update authority is signer
            true,                                      // Is mutable
            None,                                      // Collection FIXME
            None,                                      // Uses
            None,                                      // Collection Details
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

    Ok(())
}
