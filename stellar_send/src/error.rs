use soroban_sdk::contracterror;

/// Errors that can be returned by the StellarSend contract.
#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum StellarSendError {
    /// The contract has already been initialized.
    AlreadyInitialized = 1,
    /// The contract has not been initialized yet.
    NotInitialized = 2,
    /// The caller is not the admin.
    Unauthorized = 3,
    /// The amount specified is zero or negative.
    InvalidAmount = 4,
    /// The fee in basis points exceeds 10 000 (100%).
    InvalidFeeBps = 5,
    /// The sender's token balance is insufficient to cover amount + fee.
    InsufficientBalance = 6,
    /// The path payment did not produce the required minimum destination amount.
    SlippageExceeded = 7,
    /// The payment path provided is empty or malformed.
    InvalidPath = 8,
    /// Arithmetic overflow occurred during fee / amount calculation.
    ArithmeticOverflow = 9,
    /// The fee-collector address stored in config is invalid.
    InvalidFeeCollector = 10,
}
