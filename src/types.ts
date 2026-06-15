export interface PalmTraits {
  lifeLine: string;
  headLine: string;
  heartLine: string;
  fateLine: string;
  majorMount: string;
}

export interface BirthProfile {
  name: string;
  dob: string;
  tob: string;
  pob: string;
  gender: "Male" | "Female" | "Other" | "";
  language: "English" | "Sinhala" | "Mixed";
  questions: string;
  palmTraits: PalmTraits;
  palmImages: string[]; // Base64 data strings
}

export interface AstrologyResponse {
  reading: string;
}
