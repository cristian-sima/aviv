// @flow

type RowPropTypes = {
  data : any;

  showModifyModal: (id : string) => () => void;
  showDeleteModal: (id : string) => () => void;
};

import React from "react";
import { Button } from "reactstrap";

class Row extends React.Component {
  props: RowPropTypes;

  shouldComponentUpdate (nextProps : RowPropTypes) {
    return (
      this.props.data !== nextProps.data
    );
  }

  render () {
    const {
      data,
      showDeleteModal,
      showModifyModal,
    } = this.props;

    const
      ID = data.get("_id"),
      name = data.get("name"),
      username = data.get("username"),
      email = data.get("email"),
      temporaryPassword = data.get("temporaryPassword"),
      phone = data.get("phone");

    return (
      <tr>
        <td>
          {name}
        </td>
        <td>
          {username}
        </td>
        <td>
          <a href={`mailto:${email}`}>{email}</a>
        </td>
        <td>
          {phone}
        </td>
        <td className="text-center">
          {temporaryPassword}
        </td>
        <td className="text-center" style={{ minWidth: 88 }}>
          <Button
            color="primary"
            onClick={showModifyModal(ID)}
            size="sm">
            <i className="fa fa-pencil" />
          </Button>
          {" "}
          <button
            aria-label="Șterge articol"
            className="btn btn-danger btn-sm"
            onClick={showDeleteModal(ID)}
            type="button">
            <i className="fa fa-trash-o" />
          </button>
        </td>
      </tr>
    );
  }
}

export default Row;
