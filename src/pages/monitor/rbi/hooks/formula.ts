export function calculateAgeTk(
  lastInspectionDate: Date | string | null,
  yearInServiceDate: Date
): number {
  try {
    const today = new Date();

    const toValidDate = (value: Date | string | null): Date | null => {
      if (!value) return null;

      if (value instanceof Date) {
        return isNaN(value.getTime()) ? null : value;
      }

      if (typeof value === "string" && value.trim()) {
        const parsed = new Date(value);
        return isNaN(parsed.getTime()) ? null : parsed;
      }

      return null;
    };

    const inspectionDate = toValidDate(lastInspectionDate);
    const inServiceDate = toValidDate(yearInServiceDate);
    const referenceDate = inspectionDate ?? inServiceDate;

    if (!referenceDate) return 0;

    const millisecondsPerYear = 1000 * 60 * 60 * 24 * 365; // more accurate with leap years
    const ageYears = (today.getTime() - referenceDate.getTime()) / millisecondsPerYear;

    return ageYears < 0 ? 0 : parseFloat(ageYears.toFixed(6));
  } catch {
    return 0;
  }
}
