// @flow

type RowPropTypes = {
  data : any;
};

import React from "react";

class Row extends React.Component {
  props: RowPropTypes;

  shouldComponentUpdate (nextProps : RowPropTypes) {
    return (
      this.props.data !== nextProps.data
    );
  }

  render () {
    const { data } = this.props;

    const
      name = data.get("name"),
      email = data.get("email"),
      phone = data.get("phone");

    return (
      <tr>
        <td className="no-wrap">
          {name}
        </td>
        <td>
          <a href={`mailto:${email}`}>{email}</a>
        </td>
        <td className="no-wrap">
          <abbr title="Phone">
            {phone}
          </abbr>
        </td>
      </tr>
    );
  }
}

export default Row;
