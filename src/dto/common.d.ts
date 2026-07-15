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
  | "Queued"
  | "InConsultation"
  | "PharmacyPending"
  | "LabPending"
  | "DressingPending"
  | "Discharged"
  | string;

export type AdmissionType = "ColdCase" | "Emergency" | string;
export type ArrivalMode = "WalkedIn" | "BroughtIn" | "Referral" | string;
