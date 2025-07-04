export function calculateDmFatFb(
  previousFailure: number,
  visibleAudibleShaking: number,
  shakingFrequency: number,
  cyclicLoadType: number
): number {
  try {
    const option1 = previousFailure;
    const option2 = visibleAudibleShaking * shakingFrequency;
    const option3 = cyclicLoadType;

    return Math.max(option1, option2, option3);
  } catch {
    return 0;
  }
}

export function calculateDfMfat(
  dfMfatFb: number,
  correctiveAction: number,
  pipeComplexity: number,
  pipeCondition: number,
  jointBranchDesign: number,
  branchDiameter: number
): number {
  try {
    const result =
      dfMfatFb *
      correctiveAction *
      pipeComplexity *
      pipeCondition *
      jointBranchDesign *
      branchDiameter;

    return parseFloat(result.toFixed(6));
  } catch {
    return 0;
  }
}
