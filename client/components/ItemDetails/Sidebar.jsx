// @flow

import React from "react";
import moment from "moment";

type SidebarPropTypes = {
  data: any;
  institutions: any;
  isAdvicer: bool;

  modifyItem: () => void;
  confirmDeleteItem: () => void;
  showHistoryModal: () => void;
};

class Sidebar extends React.Component {
  props: SidebarPropTypes;

  shouldComponentUpdate (nextProps : SidebarPropTypes) {
    return (
      this.props.isAdvicer !== nextProps.isAdvicer ||
        this.props.data !== nextProps.data ||
        this.props.institutions !== nextProps.institutions
    );
  }

  render () {
    const {
      isAdvicer,
      confirmDeleteItem,
      data,
      showHistoryModal,
      institutions,
      modifyItem,
    } = this.props;

    const
      authors = data.get("authors"),
      version = data.get("version"),
      date = data.get("date");

    return (
      <div>
        {
          isAdvicer ? null : (
            <div>
              <button
                className="btn-link"
                onClick={modifyItem}>
                {"Modifică datele"}
              </button>
              <br />
              <button
                className="btn-link text-danger"
                onClick={confirmDeleteItem}>
                {"Retrage actul normativ"}
              </button>
              <hr />
            </div>
          )
        }
        { moment(date).format("lll") }
        <hr />
        {"Versiunea"}
        <span className="badge badge-pill badge-info ml-1">
          {version}
        </span>
        {
          version === 1 ? null : (
            <button
              className="btn-link"
              onClick={showHistoryModal}>
              {"Vezi istoric"}
            </button>
          )
        }
        <hr />
        <strong>
          {
            authors.size === 1 ? "Inițiator" : "Inițiatori"
          }
        </strong>
        <div className="small">
          {
            authors.map((author) => (
              <div key={author}>
                <span>{"- "}</span>
                {
                  institutions.getIn([
                    author,
                    "name",
                  ])
                }
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}

export default Sidebar;
