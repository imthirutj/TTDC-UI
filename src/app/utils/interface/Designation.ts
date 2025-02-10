export class Designation {

    designationId: number;

    designationName: string;

    minimumYears: number;
    constructor(data?: Partial<Designation>) {
      this.designationId = data?.designationId ?? 0;

      this.designationName = data?.designationName ?? '';

      this.minimumYears = data?.minimumYears ?? 0;
    }
  }
  