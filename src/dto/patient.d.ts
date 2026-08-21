export interface RegisterPatientDTO {
  fullName?: string | null;
  age: number;
  sex?: string | null;
  phone?: string | null;
  address?: string | null;
  nextOfKinName: string;
  nextOfKinPhone: string;
  nextOfKinRelationship: string;
}

export interface Patient {
  id: string;
  fullName?: string;
  age?: number;
  sex?: string;
  phone?: string;
  address?: string;
  nextOfKinName?: string;
  nextOfKinPhone?: string;
  nextOfKinRelationship?: string;
  createdAt?: string;
}
