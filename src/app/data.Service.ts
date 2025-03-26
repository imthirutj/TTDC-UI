import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment/environment';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from './utils/widgets/snack-bar/snack-bar/snack-bar.component';
import { LoadingService } from './services/loading.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './utils/widgets/confirmation-dialog/confirmation-dialog.component';
import * as XLSX from 'xlsx'; // Import XLSX
import 'jspdf-autotable';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private user: any;
  private apiUrl = environment.API_URL;

  genderTypes = ["Male", "Female", "Other", "Non-binary", "Prefer not to say"];

  userTypes = [
    { key: 'STATE_ADMIN', value: 'State Admin' },
    { key: 'DMER_ADMIN', value: 'DMER Admin' },
    { key: 'INSTITUTION_ADMIN', value: 'Institution Admin' },
    { key: 'IFPU', value: 'IFPU' },
    { key: 'FSU', value: 'FSU' },
    { key: 'SFU', value: 'SFU' },
  ];

  public monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    private loadingService: LoadingService,
    private dialog: MatDialog
  ) {
    this.initializeUser();
  }

  private initializeUser(): void {
    this.user = JSON.parse(
      localStorage.getItem('user') || sessionStorage.getItem('user') || '{}'
    );
  }

  public async setAuthTokenAndUser(token: string, user: any, rememberMe: boolean): Promise<void> {
    await this.setUserAndToken(token, user, rememberMe);
  }

  private async setUserAndToken(
    token: string,
    user: any,
    rememberMe: boolean
  ): Promise<void> {
    delete user.token;
    if (rememberMe) {
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      sessionStorage.setItem('authToken', token);
      sessionStorage.setItem('user', JSON.stringify(user));
    }
    this.initializeUser();
  }

  getUser(): any {
    return this.user;
  }

  isLoggedIn(): boolean {
    return (
      this.user != null &&
      this.getToken() != null &&
      this.getToken() !== '' &&
      this.getToken() !== 'undefined'
    );
  }

  async getUserAccessLevel(): Promise<string | null> {
    return this.user?.role || null;
  }

  async asyncGetUser(): Promise<string | null> {
    return this.user || null;
  }

  getUserId(): string | null {
    return this.user?.userId || null;
  }

  getCompanyId(): string | null {
    return this.user?.companyId || null;
  }

  private getToken(): string | null {
    return (
      localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
    );
  }

  public removeToken(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.user = null;
  }

  getInstitutionId(): string | null {
    return this.user?.medical_college_id || null;
  }

  logout(): void {
    this.removeToken();
    this.router.navigate(['/login']);
  }

  buildQueryParams(payload: any): string {
    return Object.keys(payload)
      .filter((key) => payload[key] != null)
      .map((key) => `${key}=${payload[key]}`)
      .join('&');
  }

  getPayloadValue(filters: any): any {
    const payload: any = {};

    Object.keys(filters).forEach((key) => {
      const filter = filters[key];
      if (filter.includeInSearchParams) {
        payload[filter.key] = filter.value;
      }
    });

    return payload;
  }

  showSnackBar(message: string, errorType: 'Default' | 'Warn' | 'Error' = 'Default'): void {
    this.snackBar.openFromComponent(SnackBarComponent, {
      data: { message, errorType },
      duration: 5000,
    });
  }


  openConfirmationDialog(message: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: { message: message }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      } else {
        // User clicked Cancel
        console.log('Action canceled');
      }
    });
  }

  openConfirmationDialog2(config: {
    title: string;
    message: string;
    onYes: () => void;
  }): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: config.title,
        message: config.message
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // User clicked Yes
        config.onYes();
      } else {
        // User clicked Cancel
        console.log('Action canceled');
      }
    });
  }

  downloadPDF(elementId: string): void {
    const element = document.getElementById(elementId);

    if (element) {
      this.loadingService.setLoadingState(true, 'Generating PDF...');

      html2canvas(element)
        .then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          const imgWidth = 210; // A4 width in mm
          const pageHeight = 297; // A4 height in mm
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          let heightLeft = imgHeight;
          let position = 0;

          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;

          while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
          }

          pdf.save('data.pdf');
          this.loadingService.clearLoadingState();
        })
        .catch((error) => {
          this.loadingService.setErrorState(error, 'Error generating PDF');
        });
    }
  }


  // Parse URL into path and query parameters
  parseUrl(returnUrl: string): { path: string; queryParams: { [key: string]: string } } {
    const url = new URL(returnUrl, window.location.origin); // Handle both absolute and relative URLs
    const path = url.pathname;  // Extract path (e.g., '/payslip/91')
    const queryParams = new URLSearchParams(url.search);  // Extract query parameters

    // Declare queryParamsObj as an object with string keys and string values
    const queryParamsObj: { [key: string]: string } = {};

    queryParams.forEach((value, key) => {
      queryParamsObj[key] = value;
    });

    return { path, queryParams: queryParamsObj };
  }

  calculateDays(fromDate: string, toDate: string): number | string {
    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);

    if (fromDate && toDate && endDate >= startDate) {
      const timeDiff = endDate.getTime() - startDate.getTime();
      return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // Including both dates
    } else {
      return ''; // Return empty if invalid
    }
  }



  // Download Excel
  // downloadExcelTable(tableId: string, fileName: string) {
  //   const table = document.getElementById(tableId);

  //   const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table as HTMLTableElement);
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'Payments');
  //   XLSX.writeFile(wb, `${fileName}.xlsx`);
  // }


  // Download Excel with column exclusion support
  downloadExcelTable(tableId: string, fileName: string, excludeColumns: string[] = []) {
    const table = document.getElementById(tableId) as HTMLTableElement;
    if (!table) {
      console.error("Table not found!");
      return;
    }

    // Convert table to sheet
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);

    // Get column headers (A1, B1, C1, etc.)
    const range = XLSX.utils.decode_range(ws["!ref"]!);
    const headers: string[] = [];

    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = { c: C, r: range.s.r }; // Get header cell (first row)
      const cellRef = XLSX.utils.encode_cell(cellAddress);
      const cellValue = ws[cellRef]?.v; // Read cell value

      if (cellValue) headers.push(cellValue.toString());
    }

    // Find column indexes to exclude
    const excludeIndexes = headers
      .map((header, index) => (excludeColumns.includes(header) ? index : -1))
      .filter(index => index !== -1);

    // Remove excluded columns
    excludeIndexes.reverse().forEach(colIdx => {
      for (let R = range.s.r; R <= range.e.r; ++R) {
        const cellRef = XLSX.utils.encode_cell({ c: colIdx, r: R });
        delete ws[cellRef];
      }
    });

    // Recalculate range after column removal
    const newCols = headers.length - excludeIndexes.length;
    ws["!ref"] = XLSX.utils.encode_range({
      s: { c: 0, r: range.s.r },
      e: { c: newCols - 1, r: range.e.r },
    });

    // Create workbook and export
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payments");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }

  // Function to convert 'dd/MM/yyyy' to 'yyyy-MM-dd'
  convertDateFormat(dateString: string): string {
    const parts = dateString.split('/'); // Split the date into parts [day, month, year]
    const day = parts[0];
    const month = parts[1];
    const year = parts[2];

    // Return the date in 'yyyy-MM-dd' format
    return `${year}-${month}-${day}`;
  }
  formatDateWithoutTimezone(date: Date): string {
    const localDate = new Date(date);  // Create a new Date instance to avoid modifying the original
    localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset()); // Adjust to local time
    return localDate.toISOString().split('T')[0]; // Format the date as 'yyyy-MM-dd'
  }



  executeBatches(requests: (() => Promise<void>)[], batchSize: number, delay: number) {
    const executeBatch = async (batch: (() => Promise<void>)[]) => {
      for (const request of batch) {
        await request(); // Wait for each request to complete
      }
    };

    const batches = [];
    for (let i = 0; i < requests.length; i += batchSize) {
      const batch = requests.slice(i, i + batchSize);
      batches.push(batch);
    }

    batches.reduce((promise, batch, index) => {
      return promise.then(() =>
        new Promise((resolve) => {
          setTimeout(() => {
            executeBatch(batch).then(resolve);
          }, index * delay);
        })
      );
    }, Promise.resolve());
  }

  getMonthName(month: number): string {
    return this.monthNames[month - 1] || '';
  }


  getCurrentPayrollMonth(): number {
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // JavaScript months are 0-based
    const day = today.getDate();

    // If today is on or after the 26th, payroll month is the next month
    let payrollMonth = currentMonth + 1;

    // If it's December, roll over to January
    if (payrollMonth > 12) {
      payrollMonth = 1;
    }

    return payrollMonth;
  }

  getCurrentLocation(): Promise<{ lat: number; long: number }> {
    return new Promise((resolve, reject) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const long = position.coords.longitude;
            console.log(`Latitude: ${lat}, Longitude: ${long}`);
            resolve({ lat, long });
          },
          (error) => {
            console.error('Error getting location:', error);
            reject(error);
          }
        );
      } else {
        const errorMsg = 'Geolocation is not supported by this browser.';
        console.error(errorMsg);
        reject(new Error(errorMsg));
      }
    });
  }



  private passedFilters: any = {}; // Store filters globally

  setFilters(filters: any) {
    this.passedFilters = filters;
  }

  getFilters(): Promise<any> {
    return Promise.resolve(this.passedFilters); // Ensure async behavior
  }


  applyFilter(myFilters: any): Promise<void> {
    return this.getFilters().then((filters) => {
      Object.keys(myFilters).forEach((key) => {
        const filterKey = myFilters[key]?.key; // Get the filter key
        if(filterKey == 'month') {
          console.log('Debug');
        }
        if (filterKey && filters[filterKey] !== undefined && filters[filterKey] !== ''
          && filters[filterKey] !== null && filters[filterKey] !== 0) {
          myFilters[key].value = filters[filterKey]; // Apply filter
        }
      });
    });
  }
  

  unitName = '';
  //get setter for unit Name
  setUnitName(name: string) {
    this.unitName = name;
  }

  
}
