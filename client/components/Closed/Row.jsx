// @flow

import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";

type RowPropTypes = {
  data: any;
};

class Row extends React.Component<RowPropTypes> {
  props: RowPropTypes;

  shouldComponentUpdate (nextProps : RowPropTypes) {
    return (
      this.props.data !== nextProps.data
    );
  }

  render () {
    const { data } = this.props;

    const
      id = data.get("_id"),
      date = data.get("date"),
      name = data.get("name");

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
      </tr>
    );
  }
}

export default Row;
