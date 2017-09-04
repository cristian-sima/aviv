// @flow

export const
  PozitiveWithoutObservations = 0,
  PozitiveWithObservations = 1,
  Negative = 2;

export const isGoodAdviceResponse = (value : number) => (
  value === PozitiveWithoutObservations ||
  value === PozitiveWithObservations ||
  value === Negative
);

export const shouldExaminate = (value : number) => (
  value === PozitiveWithObservations ||
  value === Negative
);
