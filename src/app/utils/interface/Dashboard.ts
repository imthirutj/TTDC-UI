export class DashboardData {
  totalVendor: number;
  totalCompany: number;
  totalDesignationCount: number;
  totalEmployees: number;
  paymentGeneratedCount: number;
  paymentNotGeneratedCount: number;
  paymentProcessedForSelectedMonth: number;

  constructor(data?: Partial<DashboardData>) {
    this.totalVendor = data?.totalVendor ?? 0;
    this.totalCompany = data?.totalCompany ?? 0;
    this.totalDesignationCount = data?.totalDesignationCount ?? 0;
    this.totalEmployees = data?.totalEmployees ?? 0;
    this.paymentGeneratedCount = data?.paymentGeneratedCount ?? 0;
    this.paymentNotGeneratedCount = data?.paymentNotGeneratedCount ?? 0;
    this.paymentProcessedForSelectedMonth = data?.paymentProcessedForSelectedMonth ?? 0;
  }
}
