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

export class AttendanceSummaryDashboard{
  totalPresentDays: number;
  totalAbsentDays: number;
  weekOff: number;
  holiday: number;
  leaveRequestedDays: number;
  leaveApprovedDays: number;
  leaveRejectedDays: number;
  odRequestedDays: number;
  odApprovedDays: number;
  odRejectedDays: number;

  constructor(data?: Partial<AttendanceSummaryDashboard>) {
    this.totalPresentDays = data?.totalPresentDays ?? 0;
    this.totalAbsentDays = data?.totalAbsentDays ?? 0;
    this.weekOff = data?.weekOff ?? 0;
    this.holiday = data?.holiday ?? 0;
    this.leaveRequestedDays = data?.leaveRequestedDays ?? 0;
    this.leaveApprovedDays = data?.leaveApprovedDays ?? 0;
    this.leaveRejectedDays = data?.leaveRejectedDays ?? 0;
    this.odRequestedDays = data?.odRequestedDays ?? 0;
    this.odApprovedDays = data?.odApprovedDays ?? 0;
    this.odRejectedDays = data?.odRejectedDays ?? 0;
  }
}

