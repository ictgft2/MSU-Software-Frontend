export interface LabRequest {
  id: string;
  encounterId?: string;
  patientId?: string;
  patientName?: string;
  testName?: string;
  status?: string;
}

export interface LabResultValueDTO {
  parameter: string;
  value: string;
  unit: string;
  referenceRange: string;
}

export interface SubmitLabResultDTO {
  scientistId: string;
  testName: string;
  findings: string;
  values: LabResultValueDTO[];
  conclusion: string;
}

export interface DressingOrder {
  id: string;
  encounterId?: string;
  patientId?: string;
  patientName?: string;
  instructions?: string;
  status?: string;
}

export interface CompleteDressingDTO {
  performedBy: string;
  procedureNotes: string;
}
