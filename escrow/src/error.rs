use soroban_sdk::contracterror;

/// Errors that can be returned by the Escrow contract.
#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum EscrowError {
    /// The escrow id does not exist.
    EscrowNotFound = 1,
    /// The amount specified is zero or negative.
    InvalidAmount = 2,
    /// `unlock_time` must be a ledger timestamp strictly in the future.
    InvalidUnlockTime = 3,
    /// The depositor and beneficiary must be different addresses.
    SelfEscrowNotAllowed = 4,
    /// The escrow has already been released to the beneficiary.
    AlreadyReleased = 5,
    /// The escrow has already been refunded to the depositor.
    AlreadyRefunded = 6,
    /// The caller is not permitted to perform this action on this escrow.
    Unauthorized = 7,
    /// Attempted to release before `unlock_time` by someone other than the
    /// arbiter.
    NotYetUnlocked = 8,
    /// Attempted to refund before the depositor's refund window has opened
    /// (see `release_escrow`/`refund_escrow` docs for the exact rule).
    RefundNotYetAvailable = 9,
    /// Arithmetic overflow occurred during amount calculation.
    ArithmeticOverflow = 10,
}
