// @flow

import type { AccountCategory } from "../types";


type GetMarcaArgTypes = {
  Position1?: string;
  Position2?: string;
  Position3?: string;
}

type DataType = {| nume : string; prenume: string; marca: string; grup: string; vot: boolean; |};

type PrepareUserType = (data : DataType, temporaryPassword : string) => {|
  name: string;
  marca: number;
  group: string;
  temporaryPassword: string;
  requireChange: boolean;
  canVote: boolean;
  category: AccountCategory;
|}

import { contParlamentar } from "../utility";

export const getMarca = ({ Position1, Position2, Position3 } : GetMarcaArgTypes) => (
  Number(`${Position1 || " "}${Position2 || " "}${Position3 || " "}`)
);

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
    name     : `${nume} ${prenume}`,
    marca    : Number(marca),
    group    : grup,
    temporaryPassword,
    canVote  : vot,
    category : contParlamentar,

    requireChange: true,
  };
};
