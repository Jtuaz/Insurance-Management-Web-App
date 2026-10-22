import {
    Component,
    OnInit,
    ChangeDetectorRef
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { Claim } from '../../services/claim';
import { ClaimModel } from '../../models/claim';

import { Policy } from '../../services/policy';
import { PolicyModel } from '../../models/policy';

@Component({
    selector: 'app-claims',
    imports: [
        FormsModule
    ],
    templateUrl: './claims.html',
    styleUrl: './claims.css'
})
export class Claims implements OnInit {

    claims: ClaimModel[] = [];

    policies: PolicyModel[] = [];

    errorMessage: string = '';

    successMessage: string = '';

    showCreateForm: boolean = false;

    editingClaimId: number | null = null;

    newClaim = {
        policyId: 0,
        claimDate: '',
        amountClaimed: 0
    };

    constructor(
        private claimService: Claim,
        private policyService: Policy,
        private cdr: ChangeDetectorRef
    ) {
    }

    ngOnInit(): void {

        this.loadClaims();

        this.loadPolicies();
    }

    loadClaims(): void {

        this.claimService
            .getClaims()
            .subscribe({

                next: (response) => {

                    console.log(
                        'Claims received:',
                        response
                    );

                    console.log(
                        'Number of claims:',
                        response.length
                    );

                    this.claims = response;

                    this.cdr.detectChanges();
                },

                error: (error) => {

                    console.error(
                        'Claim error:',
                        error
                    );

                    this.errorMessage =
                        'Unable to load your claims.';

                    this.cdr.detectChanges();
                }
            });
    }

    loadPolicies(): void {

        this.policyService
            .getPolicies()
            .subscribe({

                next: (response) => {

                    console.log(
                        'Policies received:',
                        response
                    );

                    this.policies = response;

                    this.cdr.detectChanges();
                },

                error: (error) => {

                    console.error(
                        'Policy error:',
                        error
                    );

                    this.errorMessage =
                        'Unable to load your policies.';

                    this.cdr.detectChanges();
                }
            });
    }

    openCreateForm(): void {

        this.showCreateForm = true;

        this.successMessage = '';

        this.errorMessage = '';

        this.editingClaimId = null;

        this.resetForm();

        this.cdr.detectChanges();
    }

    cancelCreate(): void {

        this.showCreateForm = false;

        this.resetForm();

        this.cdr.detectChanges();
    }

    createClaim(): void {

        this.errorMessage = '';

        this.successMessage = '';

        if (
            this.newClaim.policyId === 0 ||
            !this.newClaim.claimDate
        ) {

            this.errorMessage =
                'Please complete all required fields.';

            this.cdr.detectChanges();

            return;
        }

        if (
            this.newClaim.amountClaimed <= 0
        ) {

            this.errorMessage =
                'Claim amount must be greater than zero.';

            this.cdr.detectChanges();

            return;
        }

        this.claimService
            .createClaim(this.newClaim)
            .subscribe({

                next: (response) => {

                    console.log(
                        'Claim created:',
                        response
                    );

                    this.successMessage =
                        'Claim created successfully.';

                    this.showCreateForm = false;

                    this.resetForm();

                    this.loadClaims();

                    this.cdr.detectChanges();
                },

                error: (error) => {

                    console.error(
                        'Create claim error:',
                        error
                    );

                    this.errorMessage =
                        'Unable to create claim.';

                    this.cdr.detectChanges();
                }
            });
    }

    startEdit(claim: ClaimModel): void {

        this.editingClaimId =
            claim.claimId;

        this.newClaim = {

            policyId:
                claim.policyId,

            claimDate:
                claim.claimDate,

            amountClaimed:
                claim.amountClaimed
        };

        this.showCreateForm = false;

        this.successMessage = '';

        this.errorMessage = '';

        this.cdr.detectChanges();
    }

    cancelEdit(): void {

        this.editingClaimId = null;

        this.resetForm();

        this.cdr.detectChanges();
    }

    saveEdit(claim: ClaimModel): void {

        this.errorMessage = '';

        this.successMessage = '';

        if (!this.newClaim.claimDate) {

            this.errorMessage =
                'Please enter a claim date.';

            this.cdr.detectChanges();

            return;
        }

        if (
            this.newClaim.amountClaimed <= 0
        ) {

            this.errorMessage =
                'Claim amount must be greater than zero.';

            this.cdr.detectChanges();

            return;
        }

        const updatedClaim = {

            claimDate:
                this.newClaim.claimDate,

            amountClaimed:
                this.newClaim.amountClaimed
        };

        this.claimService
            .updateClaim(
                claim.claimId,
                updatedClaim
            )
            .subscribe({

                next: () => {

                    console.log(
                        'Claim updated.'
                    );

                    this.successMessage =
                        'Claim updated successfully.';

                    this.editingClaimId = null;

                    this.resetForm();

                    this.loadClaims();

                    this.cdr.detectChanges();
                },

                error: (error) => {

                    console.error(
                        'Update claim error:',
                        error
                    );

                    this.errorMessage =
                        'Unable to update claim.';

                    this.cdr.detectChanges();
                }
            });
    }
    deleteClaim(claimId: number): void {

        const confirmed =
            window.confirm(
                'Are you sure you want to delete this claim?'
            );

        if (!confirmed) {

            return;
        }

        this.errorMessage = '';

        this.successMessage = '';

        this.claimService
            .deleteClaim(claimId)
            .subscribe({

                next: () => {

                    console.log(
                        'Claim deleted.'
                    );

                    this.successMessage =
                        'Claim deleted successfully.';

                    this.loadClaims();

                    this.cdr.detectChanges();
                },

                error: (error) => {

                    console.error(
                        'Delete claim error:',
                        error
                    );

                    this.errorMessage =
                        'Unable to delete claim.';

                    this.cdr.detectChanges();
                }
            });
    }
    private resetForm(): void {

        this.newClaim = {

            policyId:
                this.policies.length > 0
                    ? this.policies[0].policyId
                    : 0,

            claimDate: '',

            amountClaimed: 0
        };
    }
}