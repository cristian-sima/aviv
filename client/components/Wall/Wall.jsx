// @flow
/* eslint-disable react/jsx-no-bind */

import type { Dispatch, State } from "types";

type WallContainerPropTypes = {
  connectingLive: () => void;
  reConnectingLive: () => void;
  connectedLive: () => void;
  processForm: (msg : any) => void;
  processIncommingMessage: (msg : any) => void;

  match: {
    url: string;
  };

  isMasterAccount: bool;
  isConnecting: boolean;
};

type WallContainerStateTypes = {
  socket?: any;
};

import React from "react";
import { connect } from "react-redux";
import io from "socket.io-client";
import { Redirect, Route, withRouter } from "react-router-dom";
import { stopSubmit, reset } from "redux-form/immutable";

import { LoadingMessage } from "../Messages";

import Institutions from "../Institutions";
import ToApprov from "../ToApprov";
import AddItem from "../Item/AddContainer";

import { hostname } from "../../../config-client.json";

import {
  notify,
  connectingLive as connectingLiveAction,
  reConnectingLive as reConnectingLiveAction,
  connectedLive as connectedLiveAction,
} from "actions";

import {
  getIsConnectingLive,
  getIsMasterAccount,
} from "reducers";

import processMesssages from "./processMesssages";

const
  mapStateToProps = (state : State) => ({
    isConnecting    : getIsConnectingLive(state),
    isMasterAccount : getIsMasterAccount(state),
  }),
  mapDispatchToProps = (dispatch : Dispatch) => ({
    connectingLive () {
      dispatch(connectingLiveAction());
    },
    reConnectingLive () {
      dispatch(reConnectingLiveAction());
    },
    connectedLive () {
      dispatch(connectedLiveAction());
    },
    processForm ({ status, form, error, message }) {
      switch (status) {
        case "FAILED":
          dispatch(
            stopSubmit(form, {
              "_error": error,
            })
          );
          break;
        case "SUCCESS":
          dispatch(reset(form));
          dispatch(stopSubmit(form));
          setTimeout(() => {
            dispatch(notify(message));
          });
          break;
        default:
      }
    },
    processIncommingMessage (msg) {
      processMesssages(dispatch, msg);
    },
  });

class WallContainer extends React.Component {
  props: WallContainerPropTypes;
  state: WallContainerStateTypes;

  emit: (name : string, msg : any) => void;

  constructor (props : WallContainerPropTypes) {
    super(props);

    this.state = {
    };

    this.emit = (name : string, msg : any) => {
      const { socket } = this.state;

      if (typeof socket !== "undefined") {
        socket.emit(name, msg);
      }
    };
  }

  componentDidMount () {
    const {
      connectingLive,
      connectedLive,
      reConnectingLive,
      processIncommingMessage,
      processForm,
    } = this.props;

    connectingLive();

    const socket = io(hostname, { secure: true });

    socket.on("connect", () => {
      connectedLive();
    });

    socket.on("msg", processIncommingMessage);
    socket.on("FORM", processForm);

    socket.on("disconnect", () => {
      reConnectingLive();
    });

    setTimeout(() => {
      this.setState({
        socket,
      });
    });
  }

  shouldComponentUpdate (nextProps : WallContainerPropTypes) {
    return (
      this.props.isConnecting !== nextProps.isConnecting ||
      this.props.isMasterAccount !== nextProps.isMasterAccount ||
      this.props.match.url !== nextProps.match.url
    );
  }

  componentWillUnmount () {
    const { socket } = this.state;

    if (socket) {
      socket.removeAllListeners();
    }
  }

  render () {
    const { isConnecting, isMasterAccount, match : { url } } = this.props;

    if (isConnecting) {
      return (
        <div className="container mt-3">
          <LoadingMessage message="Mă conectez..." />
        </div>
      );
    }

    if (isMasterAccount && url !== "/institutions") {
      return (
        <Redirect to="/institutions" />
      );
    }

    return (
      <div className="container mt-2">
        {
          isMasterAccount ? (
            <div>
              <Route component={() => (<Institutions emit={this.emit} />)} exact path="/institutions" />
            </div>
          ) : (
            <div>
              <Route component={() => (<AddItem emit={this.emit} />)} exact path="/add-item" />
              <Route component={() => (<ToApprov emit={this.emit} />)} exact path="/to-approv" />
            </div>
          )
        }
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(WallContainer));
