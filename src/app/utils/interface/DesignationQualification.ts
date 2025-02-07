export class DesignationQualification {
    designationQualificationId: number;
    designationId: number;
    degreeId: number;
    designationName: string;
    degreeName: string;
  
    constructor(data?: Partial<DesignationQualification>) {
      this.designationQualificationId = data?.designationQualificationId ?? 0;
      this.designationId = data?.designationId ?? 0;
      this.degreeId = data?.degreeId ?? 0;
      this.designationName = data?.designationName ?? '';
      this.degreeName = data?.degreeName ?? '';
    }
  }
  