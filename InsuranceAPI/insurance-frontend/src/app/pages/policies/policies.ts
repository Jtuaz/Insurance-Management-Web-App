import {
    Component,
    OnInit,
    ChangeDetectorRef
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { Policy } from '../../services/policy';
import { PolicyModel } from '../../models/policy';

@Component({
    selector: 'app-policies',
    imports: [
    FormsModule
    ],
    templateUrl: './policies.html',
    styleUrl: './policies.css'
})
export class Policies implements OnInit {

    policies: PolicyModel[] = [];

    errorMessage: string = '';

    successMessage: string = '';

    showCreateForm: boolean = false;

    editingPolicyId: number | null = null;

    newPolicy = {
        policyType: '',
        premiumAmount: 0,
        startDate: '',
        endDate: '',
        status: 'Active'
    };

    constructor(
        private policyService: Policy,
        private cdr: ChangeDetectorRef
    ) {
    }

    ngOnInit(): void {

        this.loadPolicies();
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

                    console.log(
                        'Number of policies:',
                        response.length
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

        this.cdr.detectChanges();
    }

    cancelCreate(): void {

        this.showCreateForm = false;

        this.resetForm();

        this.cdr.detectChanges();
    }

    createPolicy(): void {

        this.errorMessage = '';
        this.successMessage = '';

        if (
            !this.newPolicy.policyType ||
            !this.newPolicy.startDate ||
            !this.newPolicy.endDate
        ) {

            this.errorMessage =
                'Please complete all required fields.';

            this.cdr.detectChanges();

            return;
        }

        this.policyService
            .createPolicy(this.newPolicy)
            .subscribe({

                next: (response) => {

                    console.log(
                        'Policy created:',
                        response
                    );

                    this.successMessage =
                        'Policy created successfully.';

                    this.showCreateForm = false;

                    this.resetForm();

                    this.loadPolicies();

                    this.cdr.detectChanges();
                },

                error: (error) => {

                    console.error(
                        'Create policy error:',
                        error
                    );

                    this.errorMessage =
                        'Unable to create policy.';

                    this.cdr.detectChanges();
                }
            });
    }

    startEdit(policy: PolicyModel): void {

        this.editingPolicyId =
            policy.policyId;

        this.newPolicy = {
            policyType: policy.policyType,
            premiumAmount: policy.premiumAmount,
            startDate: policy.startDate,
            endDate: policy.endDate,
            status: policy.status
        };

        this.successMessage = '';

        this.errorMessage = '';

        this.cdr.detectChanges();
    }

    cancelEdit(): void {

        this.editingPolicyId = null;

        this.resetForm();

        this.cdr.detectChanges();
    }

    saveEdit(policy: PolicyModel): void {

        this.errorMessage = '';

        this.successMessage = '';

        const updatedPolicy = {

            policyType:
                this.newPolicy.policyType,

            premiumAmount:
                this.newPolicy.premiumAmount,

            startDate:
                this.newPolicy.startDate,

            endDate:
                this.newPolicy.endDate,

            status:
                this.newPolicy.status
        };

        this.policyService
            .updatePolicy(
                policy.policyId,
                updatedPolicy
            )
            .subscribe({

                next: () => {

                    console.log(
                        'Policy updated.'
                    );

                    this.successMessage =
                        'Policy updated successfully.';

                    this.editingPolicyId = null;

                    this.resetForm();

                    this.loadPolicies();

                    this.cdr.detectChanges();
                },

                error: (error) => {

                    console.error(
                        'Update policy error:',
                        error
                    );

                    this.errorMessage =
                        'Unable to update policy.';

                    this.cdr.detectChanges();
                }
            });
    }

    deletePolicy(policyId: number): void {

        const confirmed =
            window.confirm(
                'Are you sure you want to delete this policy?'
            );

        if (!confirmed) {

            return;
        }

        this.errorMessage = '';
        this.successMessage = '';

        this.policyService
            .deletePolicy(policyId)
            .subscribe({

                next: () => {

                    console.log(
                        'Policy deleted.'
                    );

                    this.successMessage =
                        'Policy deleted successfully.';

                    this.loadPolicies();

                    this.cdr.detectChanges();
                },

                error: (error) => {

                    console.error(
                        'Delete policy error:',
                        error
                    );

                    this.errorMessage =
                        'Unable to delete policy.';

                    this.cdr.detectChanges();
                }
            });
    }

    private resetForm(): void {

        this.newPolicy = {
            policyType: '',
            premiumAmount: 0,
            startDate: '',
            endDate: '',
            status: 'Active'
        };
    }
}