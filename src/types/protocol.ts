export type CaseType = "STANDARD" | "EMERGENCY";

export interface RegistrationFormData {
  fullName: string;
  age: string;
  sex: string;
  phone: string;
  address: string;
  nextOfKinName: string;
  nextOfKinPhone: string;
  nextOfKinRelationship: string;
  chiefComplaint: string;
  arrivalMode: string;
  caseType: CaseType;
}
