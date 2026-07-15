export interface QueueEntry {
  encounterId?: string;
  id?: string;
  patientId?: string;
  patientName?: string;
  fullName?: string;
  status?: string;
  position?: number;
  estimatedWaitMinutes?: number;
  admissionType?: string;
}

export interface QueuePosition {
  encounterId?: string;
  position?: number;
  estimatedWaitMinutes?: number;
}

export interface ServiceWindow {
  id?: string;
  isOpen?: boolean;
  opensAt?: string;
  closesAt?: string;
  label?: string;
  message?: string;
}

export interface DrugRegisterEntry {
  id?: string;
  drugName?: string;
  batchNumber?: string;
  quantity?: number;
  expiryDate?: string;
}
