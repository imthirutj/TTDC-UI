import { ModuleType } from "./action.enum";

// Create a mapping object to translate enum values to labels
export const ModuleTypeLabels: { [key in ModuleType]: string } = {
    [ModuleType.NONE]: 'No Module',
    [ModuleType.EMPLOYEE]: 'Employee',
    [ModuleType.ADHAR]: 'Aadhar Document',
    [ModuleType.EDUCATION_CERT]: 'Education Certificate',
    [ModuleType.EXPERIENCE_CERT]: 'Experience Certificate',
};
