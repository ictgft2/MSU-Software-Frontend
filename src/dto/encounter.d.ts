import type { AdmissionType, ArrivalMode, EncounterStatus } from "./common";

export interface OpenEncounterDTO {
  patientId: string;
  admissionType: AdmissionType;
  arrivalMode: ArrivalMode;
  chiefComplaint: string;
  registeredBy: string;
}

export interface UpdateEncounterStatusDTO {
  status: EncounterStatus;
}

export interface Encounter {
  id: string;
  patientId?: string;
  status?: EncounterStatus;
  admissionType?: AdmissionType;
  arrivalMode?: ArrivalMode;
  chiefComplaint?: string;
  patientName?: string;
  fullName?: string;
  registeredBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RecordVitalsDTO {
  recordedBy: string;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  pulseRate: number;
  temperature: number;
  spo2: number;
  respiratoryRate: number;
  weight: number;
  notes?: string;
}

export interface EncounterVitals {
  id?: string;
  encounterId?: string;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  pulseRate?: number;
  temperature?: number;
  spo2?: number;
  respiratoryRate?: number;
  weight?: number;
  notes?: string;
  recordedAt?: string;
}

export interface PrescriptionLineDTO {
  drugName: string;
  dosage: string;
  frequency: string;
  duration: string;
  route: string;
  instructions?: string;
}

export interface TreatmentPlanDTO {
  prescriptions: PrescriptionLineDTO[];
  labTests: string[];
  requiresDressing: boolean;
  dressingInstructions?: string | null;
  isReferral: boolean;
  referralFacility?: string | null;
  referralReason?: string | null;
}

export interface CreateConsultationDTO {
  doctorId: string;
  diagnosis: string[];
  clinicalNotes: string;
  treatmentPlan: TreatmentPlanDTO;
}

export interface ConsultationRecord {
  id?: string;
  encounterId?: string;
  doctorId?: string;
  diagnosis?: string[];
  clinicalNotes?: string;
  treatmentPlan?: TreatmentPlanDTO;
}
