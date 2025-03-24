// BiometricData export class
export class BiometricData {
    type: string;
    time: string;
  
    constructor(type: string = '', time: string = '') {
      this.type = type;
      this.time = time;
    }
  }
  
  // Leave export class
  export class Leave {
    leaveRequestID: number;
    requested: boolean;
    status: string;
    reason: string;
  
    constructor(
      leaveRequestID: number = 0,
      requested: boolean = false,
      status: string = '',
      reason: string = ''
    ) {
      this.leaveRequestID = leaveRequestID;
      this.requested = requested;
      this.status = status;
      this.reason = reason;
    }
  }
  
  // OD (On-Duty) export class
  export class OD {
    odRequestID: number;
    requested: boolean;
    status: string;
    reason: string;
  
    constructor(
      odRequestID: number = 0,
      requested: boolean = false,
      status: string = '',
      reason: string = ''
    ) {
      this.odRequestID = odRequestID;
      this.requested = requested;
      this.status = status;
      this.reason = reason;
    }
  }
  
  // DateDetails export class
  export class DateDetails {
    employeeId: number;
    status: string;
    oldStatus:string;
    newStatus: string;
    statusId: number;

    workingShift: string;
    shift:string;
    workingShiftCount: number;
    workingHour: number;
    holidayFlag: boolean;
    holidayName: string;

    remarks: string;
    isCompensated: string;
    compensatedDate: string;
    hasOverwrited:number;

    biometricData: BiometricData[];

    leaveRequested:number;
    leaveRequestedId: number;
    leaveRequestStatus:number;

    odRequested : number;
    odRequestId: number;
    odRequestStatus: number;

    compensateRequested: number;
    compensatedStatus: number;
    compensateEmployeeRemarks: string;
    compensateManagerRemarks: string;

    leave: Leave;
    od: OD;
    statusChanged: boolean;

    date:string;

    selected: boolean;
  
    constructor(
      employeeId: number = 0,

      statusId: number = 0,
      status: string = '',
      newStatus: string ='',
      oldStatus: string ='',

      shift: string = '',
      workingShift : string='',
      workingShiftCount: number = 0,
      workingHour: number = 0,
      holidayFlag: boolean = false,
      holidayName: string = '',

      remarks: string = '',
      isCompensated: string = 'NO',
      compensatedDate: string = '',
      hasOverwrited: number = 0,

      biometricData: BiometricData[] = [],

      leaveRequested: number = 0,
      leaveRequestedId: number = 0,
      leaveRequestStatus: number = 0,

      odRequested: number = 0,
      odRequestId: number = 0,
      odRequestStatus: number = 0,

      compensateRequested: number = 0,
      compensatedStatus: number = 0,
      compensateEmployeeRemarks: string = '', 
      compensateManagerRemarks : string = '',

      leave: Leave = new Leave(),
      od: OD = new OD(),

      date: string = '',
      selected: boolean = false
    ) {
      this.employeeId = employeeId;
      this.statusId = statusId;
      this.status = status;
      this.newStatus ='';
      this.oldStatus ='';

      this.workingShift = shift;
      this.shift = shift;
      this.workingShiftCount = workingShiftCount;
      this.workingHour = workingHour;
      this.holidayFlag = holidayFlag;
      this.holidayName = holidayName;

      this.remarks = remarks;
      this.isCompensated = isCompensated;
      this.compensatedDate = compensatedDate;
      this.hasOverwrited = hasOverwrited;

      this.biometricData = biometricData;

      this.leaveRequested = leaveRequested;
      this.leaveRequestedId = leaveRequestedId;
      this.leaveRequestStatus = leaveRequestStatus;

      this.odRequested = odRequested;
      this.odRequestId = odRequestId;
      this.odRequestStatus = odRequestStatus;

      this.compensateRequested = compensateRequested;
      this.compensatedStatus = compensatedStatus;
      this.compensateEmployeeRemarks = compensateEmployeeRemarks;
      this.compensateManagerRemarks = compensateManagerRemarks;

      this.leave = leave;
      this.od = od;
      this.statusChanged = false; 

      this.date ='';
      this.selected = selected;
    }
  }
  
  // Reports export class
  export class Reports {
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
  
    constructor(
      totalPresentDays: number = 0,
      totalAbsentDays: number = 0,
      weekOff: number = 0,
      holiday: number = 0,
      leaveRequestedDays: number = 0,
      leaveApprovedDays: number = 0,
      leaveRejectedDays: number = 0,
      odRequestedDays: number = 0,
      odApprovedDays: number = 0,
      odRejectedDays: number = 0
    ) {
      this.totalPresentDays = totalPresentDays;
      this.totalAbsentDays = totalAbsentDays;
      this.weekOff = weekOff;
      this.holiday = holiday;
      this.leaveRequestedDays = leaveRequestedDays;
      this.leaveApprovedDays = leaveApprovedDays;
      this.leaveRejectedDays = leaveRejectedDays;
      this.odRequestedDays = odRequestedDays;
      this.odApprovedDays = odApprovedDays;
      this.odRejectedDays = odRejectedDays;
    }
  }
  
  // Employee export class
  export class EmployeeStatus {
    empId: number;
    employeeName: string;
    empCode: string;
    reports: Reports;
    dates: { [key: string]: DateDetails };
    hasSalaryGenerated: boolean;
    salaryEligible: any;
  
    constructor(
      empId: number = 0,
      employeeName: string = '',
      empCode: string = '',
      reports: Reports = new Reports(),
      dates: { [key: string]: DateDetails } = {},
      hasSalaryGenerated: boolean = false,
      salaryEligible: any = {}
    ) {
      this.empId = empId;
      this.employeeName = employeeName;
      this.empCode = empCode;
      this.reports = reports;
      this.dates = dates;
      this.hasSalaryGenerated = hasSalaryGenerated;
      this.salaryEligible = salaryEligible;
    }
  }
  