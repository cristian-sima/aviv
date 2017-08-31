// @flow

const
  PozitiveWithoutObservations = 0,
  PozitiveWithObservations = 1,
  NegativeWithObservations = 2;

export const isGoodAdviceResponse = (value : number) => (
  value === PozitiveWithoutObservations ||
  value === PozitiveWithObservations ||
  value === NegativeWithObservations
);
