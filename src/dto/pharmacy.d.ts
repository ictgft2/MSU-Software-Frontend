export interface PharmacyPrescription {
  id: string;
  encounterId?: string;
  patientId?: string;
  patientName?: string;
  drugName?: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  status?: string;
  isUrgent?: boolean;
}

export interface DispensePrescriptionDTO {
  pharmacistId: string;
  quantityDispensed: number;
  batchNumber: string;
  expiryDate: string;
  notes?: string;
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
  counsellingNotes?: string;
}
