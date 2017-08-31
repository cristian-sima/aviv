// @flow

import type { Emit } from "types";

import React from "react";
import moment from "moment";

import AdviceResponse from "./AdviceResponse";
import AdvicerSection from "./AdvicerSection";

type PagePropTypes = {
  data: any;
  isAdviced: any;
  institutions: any;
  isAdvicer: bool;
  versions: any;

  emit: Emit;
  confirmDeleteItem: () => void;
  showContactsForInstitution: (id : string) => () => void;
  showDeleteItemModal: () => void;
};

class Page extends React.Component {
  props: PagePropTypes;

  shouldComponentUpdate (nextProps : PagePropTypes) {
    return (
      this.props.isAdviced !== nextProps.isAdviced ||
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
      isAdviced,
      showContactsForInstitution,
      confirmDeleteItem,
      emit,
    } = this.props;

    const
      id = data.get("_id"),
      name = data.get("name"),
      authors = data.get("authors"),
      version = data.get("version"),
      responses = data.get("responses"),
      advicers = data.get("advicers"),
      date = data.get("date");

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
            <div className="col-xl-8">
              <div>
                <span style={{
                  fontSize: 19,
                }}>{name}
                </span>
                {
                  isAdvicer ? (
                    <AdvicerSection
                      emit={emit}
                      id={id}
                      isAdviced={isAdviced}
                      responses={responses}
                    />
                  ) : null
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
              <hr />
              <strong>{"Inițiatori"}</strong>
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
          <div className="table-responsive">
            <table className="table table-sm table-hover">
              <thead>
                <tr>
                  <th>{"Instituție avizatoare"}</th>
                  <th>{"Răspuns"}</th>
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
                        </tr>
                      );
                    }

                    const currentInstitution = response.first();

                    return (
                      <tr key={advicer}>
                        <td className="no-wrap small">
                          <span
                            className="cursor-pointer"
                            onClick={showContactsForInstitution(advicer)}>
                            {currentInstitution.get("institutionName")}
                          </span>
                        </td>
                        <td className="no-wrap">
                          <AdviceResponse
                            value={currentInstitution.get("response")}
                          />
                        </td>
                      </tr>
                    );
                  })
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default Page;
