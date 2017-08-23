// @flow

type DataType = {| nume : string; prenume: string; marca: string; grup: string; vot: boolean; |};

type PrepareUserType = (data : DataType, temporaryPassword : string) => {|
  name: string;
  marca: number;
  group: string;
  temporaryPassword: string;
  requireChange: boolean;
  canVote: boolean;
|}

export const generateTemporaryPassword = () => {
  const
    min = 1000,
    max = 9999,
    raw = Math.floor(Math.random() * (max - min + 1)) + min;

  return String(raw);
};

export const prepareUser : PrepareUserType = (data, temporaryPassword) => {
  const { nume, prenume, marca, grup, vot } = data;

  return {
    name    : `${nume} ${prenume}`,
    marca   : Number(marca),
    group   : grup,
    temporaryPassword,
    canVote : vot,

    requireChange: true,
  };
};
