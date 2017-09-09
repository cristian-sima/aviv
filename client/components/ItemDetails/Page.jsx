// @flow

import type { Emit } from "types";

import React from "react";

import AdvicerSectionContainer from "./AdvicerSectionContainer";
import AdviceRow from "./AdviceRow";
import Sidebar from "./Sidebar";

type PagePropTypes = {
  data: any;
  institutions: any;
  isAdvicer: bool;
  versions: any;

  emit: Emit;

  confirmDeleteItem: () => void;
  confirmCreateVersion: () => void;
  modifyItem: () => void;
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

      confirmCreateVersion,
      confirmCloseItem,
      modifyItem,

      emit,
      confirmDeleteItem,
      showHistoryModal,
    } = this.props;

    const
      id = data.get("_id"),
      name = data.get("name"),
      responses = data.get("responses"),
      version = data.get("version"),
      advicers = data.get("advicers"),
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
                  isClosed ? (
                    <div className="fancy-text mt-3">
                      {"Trimis la SGG"}
                    </div>
                  ) : (
                    isAdvicer ? (
                      <AdvicerSectionContainer
                        emit={emit}
                        id={id}
                      />
                    ) : (
                      responses.size === advicers.size ? (

                        <div className="mt-4 mt-md-5 mb-sm-4 text-center">
                          <button
                            className="btn btn-outline-secondary mr-sm-1 mr-md-5"
                            onClick={confirmCreateVersion}
                            type="button">
                            {"Trimite la re-avizare"}
                          </button>
                          <button
                            className="btn btn-outline-secondary mt-2 mt-sm-0 ml-sm-1 ml-md-5"
                            onClick={confirmCloseItem}
                            type="button">
                            {"Trimite la SGG"}
                          </button>
                        </div>
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
                  )
                }
              </div>
            </div>
            <div className="col-xl-4">
              <Sidebar
                confirmDeleteItem={confirmDeleteItem}
                data={data}
                institutions={institutions}
                isAdvicer={isAdvicer}
                modifyItem={modifyItem}
                showHistoryModal={showHistoryModal}
              />
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
                            {"În lucru..."}
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
