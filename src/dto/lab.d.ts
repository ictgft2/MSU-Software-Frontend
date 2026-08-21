import type { DressingOrderStatus, LabRequestStatus } from "./common";

export interface LabRequest {
  id: string;
  encounterId?: string;
  patientId?: string;
  patientName?: string;
  testName?: string;
  clinicalIndication?: string;
  status?: LabRequestStatus | string;
}

export interface LabResultValueDTO {
  parameter?: string | null;
  value?: string | null;
  unit?: string | null;
  referenceRange?: string | null;
}

export interface SubmitLabResultDTO {
  scientistId: string;
  testName?: string | null;
  findings?: string | null;
  values?: LabResultValueDTO[] | null;
  conclusion?: string | null;
}

export interface LabResult {
  id?: string;
  requestId?: string;
  encounterId?: string;
  testName?: string;
  findings?: string;
  values?: LabResultValueDTO[];
  conclusion?: string;
  recordedAt?: string;
}

export interface DressingOrder {
  id: string;
  encounterId?: string;
  patientId?: string;
  patientName?: string;
  instructions?: string;
  status?: DressingOrderStatus | string;
}

export interface CompleteDressingDTO {
  performedBy: string;
  procedureNotes?: string | null;
}
