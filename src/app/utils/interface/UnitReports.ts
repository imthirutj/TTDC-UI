export class UnitReports {
    Unit: string;
    TotalEmployees: number;
    TotalDesignations: number;
    TotalVendors: number;
    TotalDepartments: number;
    OverallSalarySum: number;
    TotalLeaveRequests: number;
    TotalODRequests: number;

    percentage: number;
    generatedSalarySum: number;
    newEmployeeCount:number;

    ODCount: number;
    LeaveCount: number;

    constructor(data: any = {}) {
        this.Unit = data.Unit || '';
        this.TotalEmployees = data.TotalEmployees || 0;
        this.TotalDesignations = data.TotalDesignations || 0;
        this.TotalVendors = data.TotalVendors || 0;
        this.TotalDepartments = data.TotalDepartments || 0;
        this.OverallSalarySum = data.OverallSalarySum || 0;
        this.TotalLeaveRequests = data.TotalLeaveRequests || 0;
        this.TotalODRequests = data.TotalODRequests || 0;

        this.percentage = data.percentage || 0;
        this.generatedSalarySum = data.generatedSalarySum ||0;

        this.newEmployeeCount = data.newEmployeeCount || 0;

        this.ODCount = data.ODCount || 0;
        this.LeaveCount = data.LeaveCount || 0;
    }
}
