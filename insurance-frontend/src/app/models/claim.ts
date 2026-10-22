export interface Claim {
  claimId: number;
  policyId: number;
  claimDate: string;
  amountClaimed: number;
  status: string;
}

export interface CreateClaimRequest {
  policyId: number;
  claimDate: string;
  amountClaimed: number;
}

export interface UpdateClaimRequest {
  claimDate: string;
  amountClaimed: number;
}
