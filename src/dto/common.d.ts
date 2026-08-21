export type ValidationErrors = Record<string, string>;

export interface ErrorResponse {
  message: string;
  errors?: ValidationErrors;
  status?: number;
  success?: boolean;
}

export interface SuccessResponse<T> {
  message?: string;
  data: T;
  success?: boolean;
}

export type EncounterStatus =
  | "Admitted"
  | "InTreatment"
  | "Registered"
  | "BpCheck"
  | "Queued"
  | "InConsultation"
  | "PharmacyPending"
  | "LabPending"
  | "DressingPending"
  | "AwaitingHandover"
  | "Discharged"
  | "Referred";

export type AdmissionType = "Emergency" | "ColdCase";

export type ArrivalMode = "WalkedIn" | "Stretcher" | "Supported";

export type DrugRoute = "Oral" | "IV" | "IM" | "Topical";

export type DressingOrderStatus = "Pending" | "InProgress" | "Completed";

export type LabRequestStatus = "Pending" | "InProgress" | "Completed" | "Cancelled";

export type PrescriptionStatus = "Pending" | "Dispensed" | "HandedOver";

export interface EncounterListQuery {
  status?: EncounterStatus;
  date?: string;
  type?: AdmissionType;
}

export interface DateStatusQuery {
  status?: string;
  date?: string;
}

export interface PatientSearchQuery {
  name?: string;
  phone?: string;
}

export interface DrugRegisterQuery {
  date?: string;
  page?: number;
  limit?: number;
}

export interface DrugRegisterExportQuery {
  date?: string;
  format?: string;
}
