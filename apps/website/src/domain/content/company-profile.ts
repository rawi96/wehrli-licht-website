/** Business facts for structured data and llms.txt. Empty fields are null (or empty lists). */
export type CompanyProfile = {
  description: string | null;
  /** Introduction for AI assistants (llms.txt). */
  llmsIntro: string | null;
  foundingYear: number | null;
  addressRegion: string | null;
  areaServed: string[];
  expertise: string[];
  location: { latitude: number; longitude: number } | null;
};
