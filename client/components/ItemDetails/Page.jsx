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
  confirmDebateItem: () => void;

  showContactsForInstitution: (id : string) => () => void;
  showHistoryModal: () => void;
  showDeleteItemModal: () => void;
};

class Page extends React.Component<PagePropTypes> {
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
      confirmDebateItem,
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
      isDebating = data.get("isDebating"),
      isClosed = data.get("isClosed");

    const currentVersion = versions.filter((current) => {
      if (typeof current === "undefined") {
        return current;
      }

      return current.get("version") === version;
    });

    return (
      <div className="mt-3">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-xl-4">
              <Sidebar
                confirmDeleteItem={confirmDeleteItem}
                data={data}
                institutions={institutions}
                isAdvicer={isAdvicer}
                modifyItem={modifyItem}
                showHistoryModal={showHistoryModal}
              />
            </div>
            <div className="col-lg-8 col-xl-8 mt-3 mt-xl-0">
              <div>
                <span style={{
                  fontSize: 19,
                }}>{name}
                </span>
                {
                  isClosed ? null : (
                    isAdvicer ? (
                      isDebating ? null : (
                        <AdvicerSectionContainer
                          emit={emit}
                          id={id}
                        />
                      )
                    ) : (
                      responses.size === advicers.size ? (
                        <div className="mt-4 mt-md-5 mb-sm-4 text-center">
                          <div className="mb-1">
                            <button
                              className="btn btn-outline-secondary"
                              onClick={confirmCreateVersion}
                              type="button">
                              <i className="fa fa-retweet mr-1" />
                              {"Trimite la re-avizare"}
                            </button>
                            {
                              isDebating ? null : (
                                <button
                                  className="
                                  btn btn-outline-secondary
                                  ml-sm-1 ml-md-5 mt-2 mt-sm-0 ml-sm-1 ml-md-5
                                  "
                                  onClick={confirmDebateItem}
                                  type="button">
                                  <i className="fa fa-comments mr-1" />
                                  {"Dezbate în ședința pregătitoare"}
                                </button>
                              )
                            }
                          </div>
                          <hr />
                          <button
                            className="btn btn-outline-secondary mt-2 mt-sm-0 d-inline"
                            onClick={confirmCloseItem}
                            type="button">
                            {"Trimite la SGG"}
                            <i className="fa fa-arrow-right ml-1" />
                          </button>
                        </div>
                      ) : null
                    )
                  )
                }
              </div>
            </div>
          </div>
          <br />
          <table
            className="mb-5 table table-responsive table-sm table-hover items-to-advice-table">
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
