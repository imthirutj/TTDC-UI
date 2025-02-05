export class Holiday {
    holidayId: number;
    holidayName: string;
    companyId: number;
    holidayDate: Date;
    description: string;
    holidayGroups: string;
  
    constructor(
      holidayId: number = 0,
      holidayName: string = '',
      companyId: number = 0,
      holidayDate: Date = new Date(),
      description: string = '',
      holidayGroups: string = ''
    ) {
      this.holidayId = holidayId;
      this.holidayName = holidayName;
      this.companyId = companyId;
      this.holidayDate = holidayDate;
      this.description = description;
      this.holidayGroups = holidayGroups;
    }
  }
  