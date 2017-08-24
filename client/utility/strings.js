// @flow

export const toUpper = (str : string) : string => str.toUpperCase();

export const toLower = (str : string) : string => str.toLowerCase();

// Simona Cosovei ---> Simona Cosovei
export const toTitle = (str : string) : string => {
  const transform = (txt : string) : string => {
    const firstPart = txt.charAt(0).toUpperCase(),
      secondPart = txt.substr(1).toLowerCase();

    return `${firstPart}${secondPart}`;
  };

  return str.replace(/\S+/g, transform);
};
