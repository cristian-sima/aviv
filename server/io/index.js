// @flow

import type { ExpressServer, Database, Socket, Next } from "../types";

import createIO from "socket.io";

import * as items from "./items";

import { error, sessionMiddleware } from "../utility";

const performCreateIO = (server : ExpressServer, db : Database) => {
  const io = createIO(server);

  io.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res, next);
  });

  io.use((socket : Socket, next : Next) => {
    const
      { request } = socket,
      { session } = request;

    const thereIsASession = (
      typeof session !== "undefined" &&
        typeof session.username !== "undefined"
    );

    if (thereIsASession) {
      const
        { username } = session,
        users = db.collection("users");

      return users.findOne({ username }, (errFindOne, user) => {
        if (errFindOne) {
          return next(error(errFindOne));
        }

        if (user) {
          socket.request.user = user;
          socket.request.session.user = user;
          socket.request.session.user.password = "";
        }

        return next();
      });
    }

    return next();
  });

  io.use(({ request : { session : { user } } }, next) => {
    if (user) {
      return next();
    }

    return next(new Error("Not connected"));
  });

  io.on("connection", (socket) => {

    const { user } = socket.request.session;

    socket.join(user.institutionID);

    socket.on("ADD_ITEM", items.addItem(socket, db, io));
    // socket.on("SELECT_ITEM", items.selectItem(socket, db));
    // socket.on("EXPRESS_SUGGESTION", items.expressSuggestion(socket, db));
    // socket.on("UPDATE_COMMENT", items.updateComment(socket, db));
  });

  io.on("disconnect", (socket) => {
    const { user } = socket.request.session;

    socket.leave(user.institutionID);
  });
};

export default performCreateIO;
