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
    status: string;
    shift: string;
    biometricData: BiometricData[];
    leave: Leave;
    od: OD;
    statusChanged: boolean;
    selected: boolean;
  
    constructor(
      status: string = '',
      shift: string = '',
      biometricData: BiometricData[] = [],
      leave: Leave = new Leave(),
      od: OD = new OD(),
      selected: boolean = false
    ) {
      this.status = status;
      this.shift = shift;
      this.biometricData = biometricData;
      this.leave = leave;
      this.od = od;
      this.statusChanged = false; 
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
  
    constructor(
      empId: number = 0,
      employeeName: string = '',
      empCode: string = '',
      reports: Reports = new Reports(),
      dates: { [key: string]: DateDetails } = {}
    ) {
      this.empId = empId;
      this.employeeName = employeeName;
      this.empCode = empCode;
      this.reports = reports;
      this.dates = dates;
    }
  }
  