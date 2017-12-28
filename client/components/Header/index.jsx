// @flow

import type { State } from "types";

type HeaderPropTypes = {
  account: any;
  isConnected: bool;
  isNormalAccount: bool;
};

type HeaderStateTypes = {
  isOpen: bool;
};

import React from "react";
import { connect } from "react-redux";
import { withRouter, NavLink } from "react-router-dom";
import { Collapse, NavbarToggler, Nav, NavItem } from "reactstrap";

import {
  getIsAccountConnected,
  getIsMasterAccount,
} from "reducers";

import DisconnectBox from "./DisconnectBox";
import SearchContainer from "./SearchContainer";

const
  mapStateToProps = (state : State) => ({
    isConnected     : getIsAccountConnected(state),
    isNormalAccount : !getIsMasterAccount(state),
  });

class Header extends React.Component<HeaderPropTypes, HeaderStateTypes> {
  props: HeaderPropTypes;

  state: HeaderStateTypes;

  toggle: () => void;

  constructor (props) {
    super(props);

    this.state = {
      isOpen: false,
    };

    this.toggle = () => this.setState((prevState) => ({
      isOpen: !prevState.isOpen,
    }));
  }

  shouldComponentUpdate (nextProps : HeaderPropTypes, nextState : HeaderStateTypes) {
    return (
      this.props.isNormalAccount !== nextProps.isNormalAccount ||
      this.props.isConnected !== nextProps.isConnected ||
      this.state.isOpen !== nextState.isOpen
    );
  }

  render () {
    const {
      isConnected,
      isNormalAccount,
    } = this.props;

    return (
      <div>
        <nav className="navbar navbar-expand-md navbar-dark bg-dark">
          <span className="navbar-brand">
            <img
              alt="logo"
              className="d-inline-block align-top mr-1 text-muted"
              src="/media/small.png" />
            {"aviz.gov.ro"}
            <pre className="small d-inline text-muted">
              {" [beta]"}
            </pre>
          </span>
          {
            isConnected ? (
              <NavbarToggler onClick={this.toggle} right />
            ) : null
          }
          {
            isConnected ? (
              <Collapse isOpen={this.state.isOpen} navbar>
                {
                  isNormalAccount ? (
                    <Nav className="mr-auto" navbar>
                      <NavItem>
                        <NavLink
                          activeClassName="selected"
                          className="nav-link"
                          to="/">
                          {"Pentru avizat"}
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          activeClassName="selected"
                          className="nav-link"
                          to="/started">
                          {"Inițiate"}
                        </NavLink>
                      </NavItem>
                    </Nav>
                  ) : null
                }
                <Nav className="ml-auto" navbar>
                  {
                    isNormalAccount ? (
                      <div className="form-inline">
                        <div className="d-inline mr0 mr-lg-1">
                          <SearchContainer />
                        </div>
                      </div>
                    ) : null
                  }
                  <DisconnectBox />
                </Nav>
              </Collapse>
            ) : null
          }
        </nav>
      </div>
    );
  }
}

export default connect(mapStateToProps)(withRouter(Header));
