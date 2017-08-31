// @flow

export type User = {
  _id: any;
  username: string;
  name: string;
  phone: string;
  email: string;
  institutionID?: string;

  password?: string;
  temporaryPassword?: string;
  requireChange?: bool;
}

export type Item = {
  _id: string;
}

export type ExpressServer = any;

type Collection = {
  findOne: (query : any, callback : (error?: Error, data : any) => any) => void;
  findAndModify: (
    where : any,
    array: Array<*>,
    set: any,
    options: any,
    callback : (error?: Error, result : any) => any
  ) => void;
  insertOne: (data : any, callback : (error?: Error, data : any) => any) => void;
  find: (query: any) => {
    toArray: (callback : (error?: Error, data : any) => void) => void;
  };
  find: (query: any, callback : (error?: Error, data : any) => void) => void;
  updateMany: (where : any, set : any, callback : (error?: Error) => any) => void;
  insert: (list : any, callback : (error?: Error, result : { ops : any }) => any) => void;
  insertMany: (list : Array<*>, callback : (error?: Error, result : { ops : any }) => any) => void;
  remove: (where : any, callback : (error?: Error) => any) => void;
  update: (where : any, set : any, callback : (error?: Error) => any) => void;
}

export type Database = {
  collection: (name : string) => Collection;
}

type Session = {
  reset: () => void;
  username: number;
  user: User;
};

export type CheckerResponse = {
  error: string;
  notValid: bool;
};

type Emiter = (name : string, data? : any) => void;
type Emit = { emit: Emiter };

export type Request = {
  body: any;
  db: any;
  session: Session;
  user: User;
  params: any;
  query: any;
};

export type Response = {
  json: (data : any) => void;
  status: (status : number) => Response;
}

export type Next = (error?: Error) => any;

export type Socket = {
  request: {
    session: Session;
    user: User;
  };
  emit: Emiter;
  broadcast: Emit;
  to: (group: string) => Emit;
}
