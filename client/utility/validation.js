/* eslint-disable max-lines */
// @flow

const processErrors = ({ error, isArray, _error, arrayErrors }, { field, errors }) => {
  if (isArray) {
    if (arrayErrors) {
      errors[field] = arrayErrors;
    } else {
      errors[field] = { _error };
    }
  } else {
    errors[field] = error;
  }
};

export const extractErrorsFromCheckers = (checkers : any) => (values : any) => {
  const errors = {};

  for (const field in checkers) {
    if (Object.prototype.hasOwnProperty.call(checkers, field)) {
      const
        checker = checkers[field],
        result = checker(values.get(field)),
        { notValid } = result;

      if (notValid) {
        processErrors(result, {
          field,
          errors,
        });
      }
    }
  }

  return errors;
};

export * from "./validate";
