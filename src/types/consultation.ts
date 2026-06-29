export interface PatientHeaderInfo {
    id: string;
    name: string;
    dob: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    bloodType: string;
    lastVisit: string;
}

export interface VitalMetrics {
    bloodPressure: string;
    temperatureCelsius: number;
    weightKg: number;
    bmi: number;
    o2SaturationPercent: number;
}

export interface SoapNotes {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
}

export interface MedicationPrescription {
    id: string;
    name: string;
    dosage: string;
    durationDays: number;
}

export interface DiagnosticOrders {
    cbc: boolean;
    lipidProfile: boolean;
    ecg12Lead: boolean;
    kft: boolean;
    additionalInstructions: string;
}