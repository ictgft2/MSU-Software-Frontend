export type CaseType = 'STANDARD' | 'EMERGENCY';

export interface RegistrationFormData {
    legalFullName: string;
    dateOfBirth: string;
    contactNumber: string;
    identificationId: string;
    mainComplaint: string;
    caseType: CaseType;
}

export interface PatientRecord {
    id: string;
    name: string;
    lastVisit: string;
    status: 'DISCHARGED' | 'ONGOING';
}

export interface QueueItem {
    id: string;
    name: string;
    estimatedWaitMinutes: number;
    isStatPriority: boolean;
}

export interface ConsultationItem {
    id: string;
    name: string;
    assignedDoctor: string;
}