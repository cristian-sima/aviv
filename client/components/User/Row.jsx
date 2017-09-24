// @flow

type RowPropTypes = {
  data : any;

  confirmReset: (id : string) => () => void;
  showModifyModal: (id : string) => () => void;
  showDeleteModal: (id : string) => () => void;
};

import React from "react";
import { Button } from "reactstrap";

class Row extends React.Component<RowPropTypes> {
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
      confirmReset,
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
        <td className="no-wrap">
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
          {
            temporaryPassword === "" ? (
              <Button
                color="primary"
                onClick={confirmReset(ID)}
                size="sm">
                <i className="fa fa-refresh mr-1" />
                {"Resetează"}
              </Button>
            ) : temporaryPassword
          }
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
