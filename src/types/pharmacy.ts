export interface DispenseQueueItem {
  id: string;
  patientName: string;
  patientId: string;
  encounterId?: string;
  medicationName: string;
  dosageDetails: string;
  isUrgentStat: boolean;
}

export interface DispenseForm {
  quantityDispensed: number;
  batchNumber: string;
  expiryDate: string;
  notes: string;
}

export interface LabRequestItem {
  id: string;
  testName: string;
  patientName: string;
  patientId: string;
  status: "PROCESSING" | "PENDING" | "COMPLETED";
}

export interface LabResultDraft {
  findings: string;
  conclusion: string;
  parameter: string;
  value: string;
  unit: string;
  referenceRange: string;
}

export interface HandoverBatch {
  id: string;
  timestamp: string;
  patientName: string;
  patientId: string;
  itemsDescription: string;
  patientNameVerified: boolean;
  drugListVerified: boolean;
  dosageCounsellingDone: boolean;
  durationCounsellingDone: boolean;
  counsellingNotes: string;
}
