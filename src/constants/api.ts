/** Staff actor IDs used by clinical write endpoints (from seeded DB / env). */
export const staffIds = {
  registrar: process.env.NEXT_PUBLIC_STAFF_REGISTRAR_ID || "",
  nurse: process.env.NEXT_PUBLIC_STAFF_NURSE_ID || "",
  doctor: process.env.NEXT_PUBLIC_STAFF_DOCTOR_ID || "",
  pharmacist: process.env.NEXT_PUBLIC_STAFF_PHARMACIST_ID || "",
  protocolOfficer: process.env.NEXT_PUBLIC_STAFF_PROTOCOL_OFFICER_ID || "",
  scientist: process.env.NEXT_PUBLIC_STAFF_SCIENTIST_ID || "",
  dressingNurse: process.env.NEXT_PUBLIC_STAFF_DRESSING_NURSE_ID || "",
} as const;

export const API_V1 = "/api/v1";
