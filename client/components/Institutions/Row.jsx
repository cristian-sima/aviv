// @flow

type RowPropTypes = {
  data : any;
  modifyRow: (id : string) => () => void;
  deleteRow: (id : string) => () => void;
};

import React from "react";

const Row = ({
  data,
  modifyRow,
  deleteRow,
} : RowPropTypes) => {

  const
    id = data.get("_id"),
    name = data.get("name");

  return (
    <tr>
      <td className="no-wrap">
        {name}
      </td>
      <td className="text-center">
        <button
          className="btn btn-secondary btn-sm"
          onClick={modifyRow(id)}>
          <i className="fa fa-pencil" />
        </button>
      </td>
      <td className="text-center">
        <button
          className="btn btn-danger btn-sm"
          onClick={deleteRow(id)}>
          <i className="fa fa-trash-o" />
        </button>
      </td>
    </tr>
  );
};

export default Row;
