export class BankDetails {
    employeePayDetailId: number = 0; // Initialize with default values
    employeeId: number = 0;
    paymentType: string = '';
    panCardNumber: string = '';
    bankName: string = '';
    bankAccountNumber: string = '';
    isceCode: string = '';
    pfNumber: string = '';
    esicNumber: string = '';
    pfScheme: string = '';
    uanNumber: string = '';
  
    constructor(init?: Partial<BankDetails>) {
      Object.assign(this, init); // Optionally initialize with partial data
    }
  }
  