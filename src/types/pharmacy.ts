export interface DispenseQueueItem {
    id: string;
    patientName: string;
    patientId: string;
    medicationName: string;
    dosageDetails: string;
    isUrgentStat: boolean;
}

export interface LabRequestItem {
    id: string;
    testName: string;
    patientName: string;
    patientId: string;
    status: 'PROCESSING' | 'PENDING' | 'COMPLETED';
}

export interface HandoverBatch {
    id: string;
    timestamp: string;
    patientName: string;
    patientId: string;
    itemsDescription: string;
    isConfirmed: boolean;
}