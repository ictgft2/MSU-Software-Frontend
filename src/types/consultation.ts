import type { DrugRoute } from "@src/dto/common";

export interface PatientHeaderInfo {
  id: string;
  name: string;
  dob: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  bloodType: string;
  phone: string;
  lastVisit: string;
}

export interface VitalMetrics {
  bloodPressureSystolic: number | "";
  bloodPressureDiastolic: number | "";
  pulseRate: number | "";
  temperatureCelsius: number | "";
  weightKg: number | "";
  spo2: number | "";
  respiratoryRate: number | "";
  notes: string;
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
  frequency: string;
  durationDays: number;
  route: DrugRoute;
  instructions: string;
}

export interface DiagnosticOrders {
  cbc: boolean;
  lipidProfile: boolean;
  ecg12Lead: boolean;
  kft: boolean;
  additionalInstructions: string;
}

export interface ReferralFlags {
  requiresDressing: boolean;
  dressingInstructions: string;
  isReferral: boolean;
  referralFacility: string;
  referralReason: string;
}
