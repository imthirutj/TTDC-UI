export class EmployeePassbook {
    id: number;
    employeeId: number;
    month: number;
    year: number;
    filePath: string;
  
    constructor(data?: Partial<EmployeePassbook>) {
      this.id = data?.id || 0;
      this.employeeId = data?.employeeId || 0;
      this.month = data?.month || new Date().getMonth() + 1; // Default to current month
      this.year = data?.year || new Date().getFullYear(); // Default to current year
      this.filePath = data?.filePath || '';
    }
  }
  