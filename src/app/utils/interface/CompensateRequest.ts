export class CompensateRequest {
    employeeId: number;
    employeeName: string;
    departmentFName: string;
    companyFName: string;
    compensatedDate: string;
    compensatedStatusId: number;
    compensatedStatus: string;
    date: string;

    compensateManagerRemarks: string;
    compensateEmployeeRemarks: string;

  
    constructor(data?: Partial<CompensateRequest>) {
      this.employeeId = data?.employeeId ?? 0;
      this.employeeName = data?.employeeName ?? '';
      this.departmentFName = data?.departmentFName ?? '';
      this.companyFName = data?.companyFName ?? '';
      this.compensatedDate = data?.compensatedDate ?? '';
      this.compensatedStatusId = data?.compensatedStatusId ?? 0;
      this.compensatedStatus = data?.compensatedStatus ?? '';
      this.date = data?.date ?? '';

      this.compensateManagerRemarks = data?.compensateManagerRemarks ?? '';
      this.compensateEmployeeRemarks = data?.compensateEmployeeRemarks ?? '';
    }
  }
  