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

export const isValidEmail = (value : string) : boolean => (
  new RegExp("^.+\\@.+\\..+$").test(value)
);

export const validateEmail = (value : string) => {
  const
    notValid = (
      typeof value === "undefined" ||
      !isValidEmail(value)
    );

  return {
    notValid,
    error: "Trebuie o adresă validă de e-mail",
  };
};

export const validateUserName = (value : string) => {
  const
    lowerLimit = 2,
    upperLimit = 25,
    notValid = (
      typeof value === "undefined" ||
      value.length < lowerLimit ||
      value.length > upperLimit
    );

  return {
    notValid,
    error: `Utilizatorul are între ${lowerLimit} și ${upperLimit} de caractere`,
  };
};

export const validatePhone = (value : string) => {
  const
    upperLimit = 25,
    notValid = (
      typeof value === "undefined" ||
      value.length > upperLimit
    );

  return {
    notValid,
    error: `Telefonul are cel mult ${upperLimit} de caractere`,
  };
};

export const validateFullName = (value : string) => {
  const
    lowerLimit = 5,
    upperLimit = 100,
    notValid = (
      typeof value === "undefined" ||
      value.length < lowerLimit ||
      value.length > upperLimit
    );

  return {
    notValid,
    error: `Numele are între ${lowerLimit} și ${upperLimit} de caractere`,
  };
};

export const validateInstitutionName = (value : string) => {
  const
    lowerLimit = 5,
    upperLimit = 100,
    notValid = (
      typeof value === "undefined" ||
      value.length < lowerLimit ||
      value.length > upperLimit
    );

  return {
    notValid,
    error: `Denumirea are între ${lowerLimit} și ${upperLimit} de caractere`,
  };
};

export const validatePassword = (value : string) => {
  const
    lowerLimit = 4,
    upperLimit = 25,
    notValid = (
      typeof value === "undefined" ||
      value.length < lowerLimit ||
      value.length > upperLimit
    );

  return {
    notValid,
    error: `Parola are între ${lowerLimit} și ${upperLimit} de caractere`,
  };
};

export const validateCaptchaSolution = (value : string) => {
  const
    pattern = /^\d{6}$/,
    notValid = (
      typeof value !== "undefined" &&
      !pattern.test(value)
    );

  return {
    notValid,
    error: "Codul are exact șase cifre",
  };
};
