// @flow
/* eslint-disable react/jsx-no-bind */

import type { Dispatch, State } from "types";

type WallContainerPropTypes = {
  connectingLive: () => void;
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
import { Redirect } from "react-router-dom";
import { stopSubmit, reset } from "redux-form/immutable";

import { LoadingMessage } from "../Messages";

import InstitutionsContainer from "./InstitutionsContainer";

import { hostname } from "../../../config-client.json";

import {
  notify,
  connectingLive as connectingLiveAction,
  connectedLive as connectedLiveAction,
} from "actions";

import {
  getIsConnectingLive,
} from "reducers";

const
  mapStateToProps = (state : State) => ({
    isConnecting: getIsConnectingLive(state),
  }),
  mapDispatchToProps = (dispatch : Dispatch) => ({
    connectingLive () {
      dispatch(connectingLiveAction());
    },
    connectedLive () {
      dispatch(connectedLiveAction());
    },
    processForm ({ status, form, error, message }) {
      switch (status) {
        case "FAILED":
          dispatch(
            stopSubmit(form, {
              errors: error,
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
    const { isConnecting, isMasterAccount, match : { url } } = this.props;

    if (isConnecting) {
      return (
        <div className="container mt-3">
          <LoadingMessage message="Mă conectez..." />
        </div>
      );
    }

    if (isMasterAccount && url === "/") {
      return (
        <Redirect to="/institutions" />
      );
    }

    return (
      <InstitutionsContainer emit={this.emit} />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WallContainer);
