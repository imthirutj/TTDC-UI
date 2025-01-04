export interface Company {
    companyId: string;
    companyFName: string;
    companySName: string;
    companyAddress: string | null;
    companyIsVisible: number;
    companyeMail: string | null;
    companyWebsite: string | null;
    recordStatus: number;
    logo: string | null;
  }
  
  export interface Department {
    departmentId: string;
    departmentFName: string;
    departmentSName: string;
    description: string | null;
    recordStatus: number;
  }
  
  export interface City {
    cityId: string;
    cityName: string;
    stateId: number;
    stateName: string;
  }
  