import type { PrescriptionStatus } from "./common";

export interface PharmacyPrescription {
  id: string;
  encounterId?: string;
  patientId?: string;
  patientName?: string;
  drugName?: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  route?: string;
  instructions?: string;
  status?: PrescriptionStatus | string;
  isUrgent?: boolean;
}

export interface DispensePrescriptionDTO {
  pharmacistId: string;
  quantityDispensed: number;
  batchNumber?: string | null;
  expiryDate?: string;
  notes?: string | null;
}

export interface ProtocolHandover {
  id: string;
  encounterId?: string;
  patientId?: string;
  patientName?: string;
  itemsDescription?: string;
  status?: string;
  createdAt?: string;
}

export interface ConfirmHandoverDTO {
  protocolOfficerId: string;
  patientNameVerified: boolean;
  drugListVerified: boolean;
  dosageCounsellingDone: boolean;
  durationCounsellingDone: boolean;
  counsellingNotes?: string | null;
}
