// @flow

import React from "react";

type PropTypesHistoryRow = {
  data: any;
  showContactsForInstitution: (id : string) => () => void;
};

import moment from "moment";

import AdviceResponse from "./AdviceResponse";

class HistoryRow extends React.Component {
  props: PropTypesHistoryRow;

  shouldComponentUpdate (nextProps : PropTypesHistoryRow) {
    return (
      this.props.data !== nextProps.data
    );
  }

  render () {
    const { data, showContactsForInstitution } = this.props;

    const
      response = data.get("response"),
      institutionName = data.get("institutionName"),
      advicer = data.get("institutionID"),
      registerNumber = data.get("registerNumber"),
      adviceDate = data.get("date");

    return (
      <tr>
        <td className="no-wrap small item-name">
          <span
            className="cursor-pointer"
            onClick={showContactsForInstitution(advicer)}>
            {institutionName}
          </span>
        </td>
        <td className="no-wrap item-name">
          <AdviceResponse value={response} />
        </td>
        <td className="no-wrap item-date">
          { moment(adviceDate).format("lll") }
        </td>
        <td className="no-wrap">
          {registerNumber}
        </td>
      </tr>
    );
  }
}

export default HistoryRow;
