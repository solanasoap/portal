use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct UserProfile {
    pub authority: Pubkey,
    pub total_soaps_count: u16, // How many uniwque soaps has this pubkey
}

impl UserProfile {
    pub const MAX_SIZE: usize = 32 // authority
    + 2; // total_soaps_count
}
