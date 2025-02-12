export class Degree {
    degree_Id: number;
    degree_Name: string;

    constructor(data?: Partial<Degree>) {
        this.degree_Id = data?.degree_Id ?? 0;
        this.degree_Name = data?.degree_Name ?? '';
    }
}