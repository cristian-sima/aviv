// @flow
/* eslint-disable react/jsx-no-bind */

import type { Dispatch, State } from "types";

type WallContainerPropTypes = {
  connectingLive: () => void;
  connectedLive: () => void;
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
import { Route, withRouter } from "react-router-dom";

import { LoadingMessage } from "../Messages";
import Institutions from "../Institutions";

import { hostname } from "../../../config-client.json";

import {
  connectingLive as connectingLiveAction,
  connectedLive as connectedLiveAction,
} from "actions";

import {
  getIsConnectingLive,
  getIsMasterAccount,
} from "reducers";

const
  mapStateToProps = (state : State) => ({
    isConnecting: getIsConnectingLive(state),

    isMasterAccount: getIsMasterAccount(state),
  }),
  mapDispatchToProps = (dispatch : Dispatch) => ({
    connectingLive () {
      dispatch(connectingLiveAction());
    },
    connectedLive () {
      dispatch(connectedLiveAction());
    },
    processIncommingMessage (msg) {
      dispatch(msg);
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
      processIncommingMessage,
    } = this.props;

    connectingLive();

    const socket = io(hostname, { secure: true });

    socket.on("connect", () => {
      connectedLive();
    });

    socket.on("msg", processIncommingMessage);

    socket.on("disconnect", () => {
      connectingLive();
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
    const { isConnecting, isMasterAccount } = this.props;

    if (isConnecting) {
      return (
        <div className="container mt-3">
          <LoadingMessage message="Mă conectez..." />
        </div>
      );
    }

    return (
      <div className="container-fluid mt-2 wall">
        {
          isMasterAccount ? (
            <div>
              <Route component={() => (<Institutions emit={this.emit} />)} exact path="/institutions" />
            </div>
          ) : (
            <div className="fancy-text text-center">
              {"De realizat"}
            </div>
          )
        }
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(WallContainer));
