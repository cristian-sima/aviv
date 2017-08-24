// @flow

export type User = {
  _id?: string;
  username: string;
  name: string;
  phone: string;
  email: string;

  password: string;
  temporaryPassword: string;
  requireChange: bool;
}

export type Item = {
  _id: string;
}

export type ExpressServer = any;

type Collection = {
  findOne: (query : any, callback : (error?: Error, data : any) => any) => void;
  find: (query: any) => {
    toArray: (callback : (error?: Error, data : any) => void) => void;
  };
  updateMany: (where : any, set : any, callback : (error?: Error) => any) => void;
  insertMany: (list : Array<*>, callback : (error?: Error, result : { ops : any }) => any) => void;
  remove: (callback : (error?: Error) => any) => void;
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
