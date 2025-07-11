export class Vendor {
    vendorId: number;
    EmployeeCount : number;
    vendorName: string;
    contactNo: string;
    emailId: string;
    address: string;
    gstin: string;
    panNo: string;
    bankName: string;
    bankBranch: string;
    bankAccountNo: string;
    bankIfsc: string;
    cityId: string;
    cityName: string;
    companyDepartmentListWise: { companyId: number; companyName: string;  department:{employeeCount: number;departmentId: number; departmentName: string}[] }[];
    vendorMobileNumbers : {role:'',mobile:''}[];
    isPercent:number;
    serviceCharge:number;
    constructor(vendor: any = {}) {
        this.vendorId = vendor.vendorId || 0;
        this.EmployeeCount = vendor.EmployeeCount || 0;
        this.vendorName = vendor.vendorName || '';
        this.contactNo = vendor.contactNo || '';
        this.emailId = vendor.emailId || '';
        this.address = vendor.address || '';
        this.gstin = vendor.gstin || '';
        this.panNo = vendor.panNo || '';
        this.bankName = vendor.bankName || '';
        this.bankBranch = vendor.bankBranch || '';
        this.bankAccountNo = vendor.bankAccountNo || '';
        this.bankIfsc = vendor.bankIfsc || '';
        this.cityId = vendor.cityId || '';
        this.cityName = vendor.cityName || '';
        this.companyDepartmentListWise = vendor.companyDepartmentListWise || [];
        this.vendorMobileNumbers = vendor.vendorMobileNumbers || [];
        this.isPercent = vendor.isPercent || 0;
        this.serviceCharge = vendor.serviceCharge || 0;
    }
}