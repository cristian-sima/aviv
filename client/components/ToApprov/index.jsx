// @flow

import React from "react";

import { NavLink } from "react-router-dom";

type ToApprovPropTypes = {

};

class ToApprov extends React.Component {
  props: ToApprovPropTypes;

  // shouldComponentUpdate (nextProps : ToApprovPropTypes) {
  // // return (
  // //   this.props. !== nextProps. ||
  // // );
  // }

  render () {
    // const { } = this.props;

    return (
      <div className="text-right">
        <NavLink
          className="nav-link"
          to="/add-item">
          <button className="btn btn-success">
            <i className="fa fa-plus mr-1" />
            {"Inițiază act normativ"}
          </button>
        </NavLink>
      </div>
    );
  }
}

export default ToApprov;
