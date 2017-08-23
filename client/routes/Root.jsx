// @flow

import type { State, Dispatch, Notification } from "types";

import React from "react";

// import { Route } from "react-router";
import { ConnectedRouter } from "react-router-redux";
import { connect, Provider } from "react-redux";

import PrivateRoute from "./PrivateRoute";

import Header from "../components/Header";
import ModalRoot from "../components/Modal/Root";

import Notifications from "react-notification-system-redux";

import { deleteNotification } from "actions";

const
  mapStateToProps = (state : State) => ({
    notifications: state.notifications,
  }),
  mapDispatchToProps = (dispatch : Dispatch) => ({
    handleDismiss: (notification : Notification) => {
      dispatch(deleteNotification(notification.key));
    },
  });

const NotificationsContainer = connect(mapStateToProps, mapDispatchToProps)(Notifications);

const Root = ({ history, store } : { history : any, store : any }) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div>
        <NotificationsContainer />
        <ModalRoot />
        <Header />
        <PrivateRoute />
      </div>
    </ConnectedRouter>
  </Provider>
);

export default Root;
