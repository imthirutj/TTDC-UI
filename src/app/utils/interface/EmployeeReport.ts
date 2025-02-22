export class EmployeeReport {
    employeeId: number;
    employeeName: string;
    employeeCode: string;
    companyFName: string;
    vendorName: string;
    departmentFName: string;
    designationName: string;
    presentDays: number;
    absentDays: number;
    leaveDays: number;
    holidayDays: number;
    weekOffDays: number;
    totalWorkingHours: number;
    lateWorkDays: number;
    compOffRequested: number;
    compOffApproved: number;
  
    constructor(data: Partial<EmployeeReport>) {
      this.employeeId = data.employeeId ?? 0;
      this.employeeName = data.employeeName ?? '';
      this.employeeCode = data.employeeCode ?? '';
      this.companyFName = data.companyFName ?? '';
      this.vendorName = data.vendorName ?? '';
      this.departmentFName = data.departmentFName ?? '';
      this.designationName = data.designationName ?? '';
      this.presentDays = data.presentDays ?? 0;
      this.absentDays = data.absentDays ?? 0;
      this.leaveDays = data.leaveDays ?? 0;
      this.holidayDays = data.holidayDays ?? 0;
      this.weekOffDays = data.weekOffDays ?? 0;
      this.totalWorkingHours = data.totalWorkingHours ?? 0;
      this.lateWorkDays = data.lateWorkDays ?? 0;
      this.compOffRequested = data.compOffRequested ?? 0;
      this.compOffApproved = data.compOffApproved ?? 0;
    }
  }
  