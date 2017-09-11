// @flow

import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";

type RowPropTypes = {
  data: any;
};

const oneHundred = 100;

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
      id = data.get("_id"),
      date = data.get("date"),
      name = data.get("name"),
      responses = data.get("responses"),
      advicers = data.get("advicers"),
      needsExamination = data.get("needsExamination"),
      isDebating = data.get("isDebating"),
      progress = Math.round(responses.size / advicers.size * oneHundred);

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
        <td className="small no-wrap item-authors text-center">
          {
            progress === oneHundred ? (
              isDebating ? (
                <span>
                  <i className="fa fa-comments mr-1" />
                  {"Dezbătut în pregătitoare"}
                </span>
              ) : (
                needsExamination ? "Necesită examinare" : (
                  <i className="fa fa-check text-success fa-2x" />
                )
              )
            ) : (
              <div className="progress">
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{
                    width: `${progress}%`,
                  }}>
                  {
                    progress === 0 ? null : (
                      `${progress}%`
                    )
                  }
                </div>
              </div>
            )
          }
        </td>
      </tr>
    );
  }
}

export default Row;
