export class DashboardData {
    employee: {
      payGeneratedAmount: number;
      workingDays: number;
      dayWiseStatus: string[];
    };
    manager: {
      totalEmployees: number;
      designationWiseCount: number;
      employeePresentStatus: number;
    };
    vendor: {
      totalCompany: number;
      totalDesignationWiseCount: number;
      paymentGeneratedCount: number;
      paymentNotGeneratedCount: number;
      paymentProcessedForSelectedMonth: number;
    };
    state: {
      totalVendor: number;
      totalCompany: number;
      totalDesignationWiseCount: number;
      paymentGeneratedCount: number;
      paymentNotGeneratedCount: number;
      paymentProcessedForSelectedMonth: number;
    };
  
    constructor() {
      this.employee = {
        payGeneratedAmount: 0,
        workingDays: 0,
        dayWiseStatus: []
      };
      this.manager = {
        totalEmployees: 0,
        designationWiseCount: 0,
        employeePresentStatus: 0
      };
      this.vendor = {
        totalCompany: 0,
        totalDesignationWiseCount: 0,
        paymentGeneratedCount: 0,
        paymentNotGeneratedCount: 0,
        paymentProcessedForSelectedMonth: 0
      };
      this.state = {
        totalVendor: 0,
        totalCompany: 0,
        totalDesignationWiseCount: 0,
        paymentGeneratedCount: 0,
        paymentNotGeneratedCount: 0,
        paymentProcessedForSelectedMonth: 0
      };
    }
  }
  