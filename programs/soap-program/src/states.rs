use {anchor_lang::prelude::*};

#[account]
#[derive(Default)]
pub struct Pot {
    // it pays for the ata creation
    // mint authority of the SOAP
    pub soap_addres: Pubkey,
    pub soap_count: u8,
}

impl Pot {
    pub const MAX_SIZE: usize = 32 // soap_addres
    + 1; // soap_count
}

#[account]
#[derive(Default)]
pub struct UserProfile {
    pub authority: Pubkey,
    pub total_soaps_count: u8,
}

impl UserProfile {
    pub const MAX_SIZE: usize = 32 // authority
    + 1; // total_soaps_count
}
