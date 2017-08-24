// @flow

type DataType = {| nume : string; prenume: string; username: string; grup: string; vot: boolean; |};

type PrepareUserType = (data : DataType, temporaryPassword : string) => {|
  name: string;
  username: number;
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
  const { nume, prenume, username, grup, vot } = data;

  return {
    name     : `${nume} ${prenume}`,
    username : Number(username),
    group    : grup,
    temporaryPassword,
    canVote  : vot,

    requireChange: true,
  };
};
