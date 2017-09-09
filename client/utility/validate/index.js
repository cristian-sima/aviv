// @flow

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

export const validateItemName = (value : string) => {
  const
    lowerLimit = 5,
    upperLimit = 1000,
    notValid = (
      typeof value === "undefined" ||
      value.length < lowerLimit ||
      value.length > upperLimit
    );

  return {
    notValid,
    error: `Titlul are între ${lowerLimit} și ${upperLimit} de caractere`,
  };
};

export const validateRegisterNumber = (value : string) => {
  const
    lowerLimit = 15,
    upperLimit = 64,
    notValid = (
      typeof value === "undefined" ||
      value.length < lowerLimit ||
      value.length > upperLimit
    );

  return {
    notValid,
    error: `Numărul are între ${lowerLimit} și ${upperLimit} de caractere`,
  };
};
