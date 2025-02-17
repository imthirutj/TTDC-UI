export class EmployeeShift {
  id: number;
  name: string;
  dates: { [date: string]: { shift: string; selected: boolean; statusChanged: boolean } };

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
    this.dates = {};
  }

}
