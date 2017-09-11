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

const oneHundred = 100;

import AuthorsBox from "./AuthorsBox";

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
      date = data.get("date"),
      responses = data.get("responses"),
      needsExamination = data.get("needsExamination"),
      advicers = data.get("advicers"),
      isDebating = data.get("isDebating"),
      isClosed = data.get("isClosed");

    const progress = Math.round(responses.size / advicers.size * oneHundred);

    return (
      <div className="card">
        <div className="card-body">
          <h4 className="card-title">
            {
              isClosed ? "Trimis la SGG" : (
                isDebating ? "Dezbătut în pregătitoare" : (
                  progress === oneHundred ? (
                    "A primit toate avizele"
                  ) : "În avizare"
                )
              )
            }
          </h4>
          {
            isClosed || isDebating ? null : (
              <div className="card-text">
                {
                  progress === oneHundred ? (
                    needsExamination ? (
                      "Necesită examinare"
                    ) : "A fost avizat favorabil fără observații"
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
              </div>
            )
          }
        </div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            { moment(date).format("lll") }
          </li>
          <li className="list-group-item">
            {"Versiunea"}
            <span className="badge badge-pill badge-info ml-1">
              {version}
            </span>
            {
              version === 1 ? null : (
                <button
                  className="btn-link text-muted"
                  onClick={showHistoryModal}>
                  {"Vezi istoric"}
                </button>
              )
            }
          </li>
          <li className="list-group-item">
            <AuthorsBox
              authors={authors}
              institutions={institutions}
            />
          </li>
        </ul>
        {
          isAdvicer ? null : (
            <div className="card-body">
              {
                isClosed ? null : (
                  <button
                    className="btn btn-link"
                    onClick={modifyItem}
                    type="button">
                    {"Modifică datele"}
                  </button>
                )
              }
              <button
                className="btn btn-link text-danger"
                onClick={confirmDeleteItem}
                type="button">
                {"Retrage actul normativ"}
              </button>
            </div>
          )
        }
      </div>
    );
  }
}

export default Sidebar;
