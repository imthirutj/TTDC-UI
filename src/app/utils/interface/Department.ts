export class Department {

  departmentId: number;

  departmentFName: string;



  constructor(data?: Partial<Department>) {
    this.departmentId = data?.departmentId ?? 0;

    this.departmentFName = data?.departmentFName ?? '';

  }
}
