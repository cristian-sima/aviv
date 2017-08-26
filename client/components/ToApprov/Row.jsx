// @flow

import React from "react";

type RowPropTypes = {
  data: any;
  institutions: any;
};

import { connect } from "react-redux";

class Row extends React.Component {
  props: RowPropTypes;

  shouldComponentUpdate (nextProps : RowPropTypes) {
    return (
      this.props.data !== nextProps.data ||
      this.props.institutions !== nextProps.institutions
    );
  }

  render () {
    const { data, institutions } = this.props;

    const
      date = data.get("date"),
      name = data.get("name"),
      authors = data.get("authors");

    return (
      <tr>
        <td className="wrap">{date}</td>
        <td>{name}</td>
        <td>
          {
            authors.map((author) => institutions.getIn([
              author,
              "name",
            ]))
          }
        </td>
      </tr>
    );
  }
}

export default connect()(Row);
