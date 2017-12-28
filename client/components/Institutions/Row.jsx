// @flow

type RowPropTypes = {
  data : any;
  modifyRow: (id : string) => () => void;
  deleteRow: (id : string) => () => void;
  showUsers: (id : string) => () => void;
};

import React from "react";

const Row = (props : RowPropTypes) => {
  const {
    data,
    modifyRow,
    deleteRow,
    showUsers,
  } = props;

  const
    id = data.get("_id"),
    name = data.get("name");

  return (
    <tr>
      <td className="no-wrap">
        <button
          className="btn btn-sm btn btn-link"
          onClick={showUsers(id)}
          type="button">
          {name}
        </button>
      </td>
      <td className="text-center">
        <button
          className="btn btn-secondary btn-sm"
          onClick={modifyRow(id)}
          type="button">
          <i className="fa fa-pencil" />
        </button>
      </td>
      <td className="text-center">
        <button
          className="btn btn-danger btn-sm"
          onClick={deleteRow(id)}
          type="button">
          <i className="fa fa-trash-o" />
        </button>
      </td>
    </tr>
  );
};

export default Row;
