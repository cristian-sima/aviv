// @flow

import AdviceRow from "../ItemDetails/AdviceRow";

import React from "react";

type HistoryPropTypes = {
  item: any;
  versions: any;
  showContactsForInstitution: (id : string) => () => void;
};

class History extends React.Component<HistoryPropTypes> {
  props: HistoryPropTypes;

  shouldComponentUpdate (nextProps : HistoryPropTypes) {
    return (
      this.props.item !== nextProps.item ||
      this.props.versions !== nextProps.versions
    );
  }

  render () {
    const { versions, item, showContactsForInstitution } = this.props;

    return (
      <div>
        {
          versions.map((version, index) => (
            <div className="mt-4" key={index}>
              <strong>
                {"Versiunea"}
                <span className="ml-1 badge badge-pill badge-info">
                  {index}
                </span>
              </strong>
              <br />
              <div className="table-responsive ">
                <table
                  className="table table-sm table-hover items-to-advice-table"
                  style={{
                    overflowX : "auto",
                    display   : "block",
                  }}>
                  <thead>
                    <tr>
                      <th className="no-wrap">
                        {"Instituție avizatoare"}
                      </th>
                      <th>
                        {"Răspuns"}
                      </th>
                      <th className="no-wrap">
                        {"Avizat la"}
                      </th>
                      <th className="no-wrap">
                        {"Număr"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      version.map((advice) => (
                        <AdviceRow
                          data={advice}
                          item={item}
                          key={advice.get("_id")}
                          showContactsForInstitution={showContactsForInstitution}
                        />
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          ))
        }
      </div>
    );
  }
}

export default History;
