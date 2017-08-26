// @flow

declare var Intl:any

export * from "./forms";
export * from "./request";
export * from "./strings";
export * from "./validation";

export const
  noError = "",
  noID = "",
  nothingFetched = -1,
  notFetched = -1,
  rowsPerLoad = 25;

const plainNumberFormat : any = new Intl.NumberFormat("ro");

export const numberToLocaleForm = (value : number) : string => {
  const upperLimit = 20,
    formatted = plainNumberFormat.format(value);

  if (value < upperLimit) {
    return formatted;
  }

  return `${formatted} de`;
};
