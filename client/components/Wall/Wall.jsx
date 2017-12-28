// @flow
/* eslint-disable react/jsx-no-bind */

import type { Dispatch, State } from "types";

type WallContainerPropTypes = {
  connectingLive: () => void;
  reConnectingLive: () => void;
  connectedLive: () => void;
  processIncommingConfirmation: (msg : any) => void;
  processIncommingForm: (msg : any) => void;
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
import { Route, withRouter, Link } from "react-router-dom";

import { LoadingMessage } from "../Messages";

import Institutions from "../Institutions";
import ToAdvice from "../ToAdvice";
import Adviced from "../Adviced";
import AddItem from "../Item/AddContainer";
import ItemDetails from "../ItemDetails";
import Started from "../Started";
import Closed from "../Closed";

import {
  connectingLive as connectingLiveAction,
  reConnectingLive as reConnectingLiveAction,
  connectedLive as connectedLiveAction,
} from "actions";

import {
  getIsConnectingLive,
  getIsMasterAccount,
} from "reducers";

import processMesssages from "./processMesssages";
import processConfirmation from "./processConfirmation";
import processForm from "./processForm";

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
    processIncommingForm (msg) {
      processForm(dispatch, msg);
    },
    processIncommingConfirmation (msg) {
      processConfirmation(dispatch, msg);
    },
    processIncommingMessage (msg) {
      processMesssages(dispatch, msg);
    },
  });

class WallContainer extends React.Component<WallContainerPropTypes, WallContainerStateTypes> {
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
      processIncommingForm,
      processIncommingConfirmation,
    } = this.props;

    connectingLive();

    const socket = io("/", { secure: true });

    socket.on("connect", () => {
      connectedLive();
    });

    socket.on("msg", processIncommingMessage);
    socket.on("FORM", processIncommingForm);
    socket.on("CONFIRMATION", processIncommingConfirmation);

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

    return (
      <div className="container mt-2">
        {
          isMasterAccount ? (
            <div>
              <Institutions emit={this.emit} />
            </div>
          ) : (
            <div className="container">
              {
                url === "/add-item" ? null : (
                  <div className="text-right">
                    <Link
                      className="btn btn-success"
                      to="/add-item">
                      <i className="fa fa-plus mr-1" />
                      {"Inițiază act"}
                    </Link>
                  </div>
                )
              }
              <Route component={() => (<ItemDetails emit={this.emit} />)} exact path="/items/:item" />
              <Route component={() => (<AddItem emit={this.emit} />)} exact path="/add-item" />
              <Route component={() => (<ToAdvice emit={this.emit} />)} exact path="/" />
              <Route component={() => (<Started emit={this.emit} />)} exact path="/started" />
              <Route component={() => (<Closed emit={this.emit} />)} exact path="/closed" />
              <Route component={() => (<Adviced emit={this.emit} />)} exact path="/adviced" />
            </div>
          )
        }
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(WallContainer));
