export class Company {
    companyId: number;
    companyFName: string;
    companySName: string;
    companyAddress: string | null;
    companyIsVisible: boolean | null;
    companyeMail: string | null;
    companyWebsite: string | null;
    recordStatus: string | null;
    logo: string | null;
    cityId: number | null;
    cityName: string;
  
    constructor(
      companyId: number = 0,
      companyFName: string = "",
      companySName: string = "",
      companyAddress: string | null = null,
      companyIsVisible: boolean | null = null,
      companyeMail: string | null = null,
      companyWebsite: string | null = null,
      recordStatus: string | null = null,
      logo: string | null = null,
      cityId: number | null = null,
      cityName: string = ""
    ) {
      this.companyId = companyId;
      this.companyFName = companyFName;
      this.companySName = companySName;
      this.companyAddress = companyAddress;
      this.companyIsVisible = companyIsVisible;
      this.companyeMail = companyeMail;
      this.companyWebsite = companyWebsite;
      this.recordStatus = recordStatus;
      this.logo = logo;
      this.cityId = cityId;
      this.cityName = cityName;
    }
  }
  