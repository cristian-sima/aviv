// @flow

import type { State } from "types";

type HeaderPropTypes = {
  account: any;
  isConnected: bool;
  isPublicAccount: bool;
  location: {
    pathname: string;
  };
};

import React from "react";
import { connect } from "react-redux";
import { Link, NavLink, withRouter } from "react-router-dom";

import {
  getIsAccountConnected,
  getIsPublicAccount,
} from "reducers";

import DisconnectBox from "./DisconnectBox";

const getThings = (url) => {
  if (url === "/") {
    return {
      "icon"        : "fa fa-list-ol",
      "url"         : "/list",
      "description" : "Ordinea de Zi",
    };
  }

  return {
    "icon"        : "fa fa-newspaper-o",
    "url"         : "/",
    "description" : "Proiect curent",
  };
};

const
  mapStateToProps = (state : State) => ({
    isPublicAccount : getIsPublicAccount(state),
    isConnected     : getIsAccountConnected(state),
  });

class Header extends React.Component {
  props: HeaderPropTypes;

  shouldComponentUpdate (nextProps : HeaderPropTypes) {
    return (
      this.props.location.pathname !== nextProps.location.pathname ||
      this.props.isPublicAccount !== nextProps.isPublicAccount ||
      this.props.isConnected !== nextProps.isConnected
    );
  }

  render () {
    const {
      isConnected,
      isPublicAccount,
      location : { pathname },
    } = this.props;

    if (isConnected && isPublicAccount) {
      return null;
    }

    const things = getThings(pathname);

    return (
      <div>
        {
          isConnected ? (
            <div style={{
              position   : "fixed",
              right      : 10,
              bottom     : 10,
              zIndex     : 10,
              background : "white",
            }}>
              <Link to={things.url} >
                <button
                  className="btn btn-sm btn-secondary">
                  <i className={things.icon} />
                  {` ${things.description}`}
                </button>
              </Link>
            </div>
          ) : null
        }
        <nav className="navbar navbar-light bg-light">
          <span className="navbar-brand">
            <img alt="logo" className="d-inline-block align-top mr-1" src="/media/small.png" />
            {"aviz.gov.ro"}
          </span>
          <div className="clearfix">
            <ul className="navbar-nav float-right ml-3">
              <li className="nav-item">
                <NavLink
                  activeClassName="active"
                  className="nav-link"
                  to="/user-list">
                  {"Utilizatori"}
                </NavLink>
              </li>
            </ul>
            <div className="float-left">
              {
                isConnected ? (
                  <div className="float-right">
                    <Link className="ml-2 align-middle" to={things.url} >
                      <button
                        className="btn btn-sm btn-primary">
                        <i className={things.icon} />
                        <span className="hidden-xs-down">
                          {` ${things.description}`}
                        </span>
                      </button>
                    </Link>
                  </div>
                ) : null
              }
            </div>
            {
              isConnected ? (
                <DisconnectBox />
              ) : null
            }
          </div>
        </nav>
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps)(Header));
