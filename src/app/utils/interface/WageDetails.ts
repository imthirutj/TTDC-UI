export class WageDetails {
    basicRate: number;
    da: number; // Dearness Allowance
    hra: number; // House Rent Allowance
    specialWages: number;
    epfEmployerContribution: number; // Employer's EPF Contribution
    epfEmployeeContribution: number; // Employee's EPF Contribution
    esiEmployerContribution: number; // Employer's ESI Contribution
    esiEmployeeContribution: number; // Employee's ESI Contribution
    payableWages: number;

    constructor(wages: any = {}) {
        this.basicRate = wages.basicRate || 0;
        this.da = wages.da || 0;
        this.hra = wages.hra || 0;
        this.specialWages = wages.specialWages || 0;
        this.epfEmployerContribution = wages.epfEmployerContribution || 0;
        this.epfEmployeeContribution = wages.epfEmployeeContribution || 0;
        this.esiEmployerContribution = wages.esiEmployerContribution || 0;
        this.esiEmployeeContribution = wages.esiEmployeeContribution || 0;
        this.payableWages = wages.payableWages || 0;
    }
}
