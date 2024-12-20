// shared/dropdown-config.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'  // Ensures the service is available globally
})
export class DropdownConfigService {
  // Define the default configuration for your dropdowns
  private defaultConfig = {
    displayKey: 'name',           // Field to display in the dropdown
    search: true,                 // Enable search functionality
    placeholder: 'Select an Option',
    limitTo: 0,                  // No limit on the number of options
    noResultsFound: 'No results found!',  // Message when no options are found
  };

  constructor() {}

  // Method to get the default config
  getDefaultConfig() {
    return this.defaultConfig;
  }

  // You could also allow updates to the config if needed
  setConfig(config: any) {
    this.defaultConfig = { ...this.defaultConfig, ...config };
  }
}
