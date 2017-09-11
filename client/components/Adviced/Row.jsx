// @flow

import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";

type RowPropTypes = {
  data: any;
  institutions: any;
};

import AuthorsBox from "../ItemDetails/AuthorsBox";

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
      id = data.get("_id"),
      date = data.get("date"),
      name = data.get("name"),
      authors = data.get("authors");

    return (
      <tr>
        <td className="no-wrap item-date">
          { moment(date).format("lll") }
        </td>
        <td className="item-name">
          <Link
            to={`/items/${id}`}>
            {name}
          </Link>
        </td>
        <td className="no-wrap item-authors">
          <AuthorsBox
            authors={authors}
            institutions={institutions}
          />
        </td>
      </tr>
    );
  }
}

export default Row;
