export class Employee {
    employeeId: number;
    employeeName: string;
    employeeCode: string;
    numericCode: string;
    stringCode: string;
    gender: string;
    aadhaarNumber: string;
    dob: string;
    age: string;
    workPlace: string;
    contactNo: string;
    doj: string;
    passedOutYear: string;
    designationId: string;
    companyId: string;
    departmentId: string;
    vendorId:string;
    categoryId: string;
    stateId: string;
    cityId: string;
    qualifications: string;
    experience: string;
    loginName: string;
    loginPassword: string;
employementType: any;

    constructor() {
        this.employeeId = 0;
        this.employeeName = '';
        this.employeeCode = '';
        this.numericCode = '';
        this.stringCode = '';
        this.gender = '';
        this.aadhaarNumber = '';
        this.dob = '';
        this.age = '';
        this.workPlace = '';
        this.contactNo = '';
        this.doj = '';
        this.passedOutYear = '';
        this.designationId = '';
        this.companyId = '';
        this.departmentId = '';
        this.vendorId = '';
        this.categoryId = '';
        this.stateId = '1';
        this.cityId = '';
        this.qualifications = '';
        this.employementType = '';
        this.experience = '';
        this.loginName = 'qwerty';
        this.loginPassword = '12345';
    }
}
