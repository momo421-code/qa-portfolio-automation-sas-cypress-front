/**
 * Availability's consultation modalities.
 */
export enum ConsultationModality {
  CONSULTATION_EN_CABINET = "Consultation en cabinet",
  TELECONSULTATION = "Téléconsultation",
  VISITE_A_DOMICILE = "Visite à domicile",
}

/**
 * Legend of availability's consultation modalities.
 */
export enum ConsultationModalityLegend {
  C = "C",
  T = "T",
  D = "D",
}

export enum WeekdayNames {
  MONDAY = "Lundi",
  TUESDAY = "Mardi",
  WEDNESDAY = "Mercredi",
  THURSDAY = "Jeudi",
  FRIDAY = "Vendredi",
  SATURDAY = "Samedi",
  SUNDAY = "Dimanche",
}

/**
 * Get legend - a letter - of consultation modalities.
 *
 * @param consultationModalities
 */
export function getConsultationModalityLegends(
  consultationModalities: ConsultationModality[],
): string[] {
  const consultationModalityLegendMap: Record<
    ConsultationModality,
    ConsultationModalityLegend
  > = {
    [ConsultationModality.CONSULTATION_EN_CABINET]:
      ConsultationModalityLegend.C,
    [ConsultationModality.TELECONSULTATION]: ConsultationModalityLegend.T,
    [ConsultationModality.VISITE_A_DOMICILE]: ConsultationModalityLegend.D,
  };

  return consultationModalities.map(
    (modality: ConsultationModality) => consultationModalityLegendMap[modality],
  );
}
