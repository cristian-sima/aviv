// @flow

import type { Response, Request, Next, CheckerResponse } from "./types";

import createClientSession from "client-sessions";

const
  StatusForbidden = 403,

  notAllowedMessage = "Accesul nu este permis",

  duration = 180000000,
  activeDuration = 300000;

export const
  usernameMaster = "master",
  selectOnlyUsers = {
    username: {
      $nin: [usernameMaster],
    },
  },

  StatusServiceUnavailable = 503,

  sessionMiddleware = createClientSession({
    cookieName : "session",
    secret     : "B83hfuin3989j3*&R383hfuin3989j3+3-83hfuin3989j3_ASD",
    duration,
    activeDuration,
  }),

  isMasterAccount = (username : number) => username === usernameMaster,
  isNormalUser = (username : number) => !isMasterAccount(username),

  getToday = () => {
    const
      date = new Date(),
      year = date.getFullYear(),
      month = date.getMonth() + 1,
      day = date.getDate(),
      nine = 9,
      dayString = day < nine ? `0${String(day)}` : day,
      monthString = month < nine ? `0${String(month)}` : month;

    return `${dayString}.${monthString}.${year}`;
  },
  error = (err?: Error | string) => {
    throw (err || "Ceva nu a mers cum trebuia");
  },
  findCurrentAccount = (req : Request, res : Response, next : Next) => {

    const { session, db } = req;

    const thereIsASession = (
      typeof session !== "undefined" &&
      typeof session.username !== "undefined"
    );

    if (thereIsASession) {
      const
        { username } = session,
        users = db.collection("users");

      return users.findOne({ username }, (err, user) => {
        if (!err && user) {
          req.user = user;
          delete req.user.password;
          req.session.user = user;
        }

        // finishing processing the middleware and run the route
        next();
      });
    }

    return next();
  },

  requireLogin = (req : Request, res : Response, next : Next) => {
    if (req.user) {
      return next();
    }

    return res.status(StatusForbidden).json({
      Error: notAllowedMessage,
    });
  },

  requireMaster = ({ user : { username } } : Request, res : Response, next : Next) => {
    if (username === usernameMaster) {
      return next();
    }

    return res.status(StatusForbidden).json({
      Error: notAllowedMessage,
    });
  },

  extractErrorsFromCheckers = (checkers : any, values : any) : CheckerResponse => {
    for (const field in checkers) {
      if (Object.prototype.hasOwnProperty.call(checkers, field)) {
        const
          checker = checkers[field],
          result = checker(values[field]),
          { notValid } = result;

        if (notValid) {
          return result;
        }
      }
    }

    return {
      notValid : false,
      error    : "",
    };
  };
