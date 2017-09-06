// @flow

import type { Emit } from "types";

import React from "react";
import moment from "moment";

import AdvicerSectionContainer from "./AdvicerSectionContainer";
import AdviceRow from "./AdviceRow";

type PagePropTypes = {
  data: any;
  institutions: any;
  isAdvicer: bool;
  versions: any;

  emit: Emit;

  confirmDeleteItem: () => void;
  confirmCreateVersion: () => void;
  confirmCloseItem: () => void;

  showContactsForInstitution: (id : string) => () => void;
  showHistoryModal: () => void;
  showDeleteItemModal: () => void;
};

const oneHundred = 100;

class Page extends React.Component {
  props: PagePropTypes;

  shouldComponentUpdate (nextProps : PagePropTypes) {
    return (
      this.props.versions !== nextProps.versions ||
      this.props.data !== nextProps.data ||
      this.props.isAdvicer !== nextProps.isAdvicer ||
      this.props.institutions !== nextProps.institutions
    );
  }

  render () {
    const {
      data,
      versions,
      institutions,
      isAdvicer,
      showContactsForInstitution,
      showHistoryModal,

      confirmDeleteItem,
      confirmCreateVersion,
      confirmCloseItem,

      emit,
    } = this.props;

    const
      id = data.get("_id"),
      name = data.get("name"),
      authors = data.get("authors"),
      responses = data.get("responses"),
      version = data.get("version"),
      advicers = data.get("advicers"),
      date = data.get("date"),
      isClosed = data.get("isClosed");

    const currentVersion = versions.filter((current) => {
      if (typeof current === "undefined") {
        return current;
      }

      return current.get("version") === version;
    });

    const progress = Math.round(responses.size / advicers.size * oneHundred);

    return (
      <div className="mt-3">
        <div className="container">
          <div className="row">
            <div className="col-xl-8">
              <div>
                <span style={{
                  fontSize: 19,
                }}>{name}
                </span>
                {
                  isAdvicer ? (
                    <AdvicerSectionContainer
                      emit={emit}
                      id={id}
                    />
                  ) : (
                    responses.size === advicers.size ? (
                      isClosed ? (
                        <div className="fancy-text mt-3">
                          {"Trimis la SGG"}
                        </div>
                      ) : (
                        <div className="mt-4 mt-md-5 mb-sm-4 text-center">
                          <button
                            className="btn btn-outline-secondary mr-sm-1 mr-md-5"
                            onClick={confirmCreateVersion}
                            type="button">
                            {"Retrimite la re-avizare"}
                          </button>
                          <button
                            className="btn btn-outline-secondary mt-2 mt-sm-0 ml-sm-1 ml-md-5"
                            onClick={confirmCloseItem}
                            type="button">
                            {"Trimite la SGG"}
                          </button>
                        </div>
                      )
                    ) : (
                      <div className="mt-5 mb-md-4 progress">
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
                  )
                }
              </div>
            </div>
            <div className="col-xl-4">
              {
                isAdvicer ? null : (
                  <div>
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
          </div>
          <br />
          <table className="table table-responsive table-sm table-hover items-to-advice-table">
            <thead>
              <tr>
                <th>{"Instituție avizatoare"}</th>
                <th>{"Răspuns"}</th>
                <th className="no-wrap">{"Avizat la"}</th>
                <th className="no-wrap">{"Număr"}</th>
              </tr>
            </thead>
            <tbody>
              {
                advicers.map((advicer) => {
                  const response = currentVersion.filter((current) => (
                    current.get("institutionID") === advicer
                  ));

                  if (response.size === 0) {
                    return (
                      <tr key={advicer}>
                        <td className="no-wrap small">
                          <span
                            className="cursor-pointer"
                            onClick={showContactsForInstitution(advicer)}>
                            {
                              institutions.getIn([
                                advicer,
                                "name",
                              ])
                            }
                          </span>
                        </td>
                        <td className="no-wrap">
                          <span className="text-muted">
                            {"În așteptare"}
                          </span>
                        </td>
                        <td>{""}</td>
                        <td>{""}</td>
                      </tr>
                    );
                  }

                  const currentInstitution = response.first();

                  return (
                    <AdviceRow
                      data={currentInstitution}
                      key={advicer}
                      showContactsForInstitution={showContactsForInstitution}
                    />
                  );
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Page;
