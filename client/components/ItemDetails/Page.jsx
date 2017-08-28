// @flow

import React from "react";
import moment from "moment";

import * as Immutable from "immutable";

import AdviceForm from "./AdviceForm";

type PagePropTypes = {
  data: any;
  institutions: any;
  isAdvicer: bool;
  showDeleteItemModal: () => void;
};

class Page extends React.Component {
  props: PagePropTypes;

  shouldComponentUpdate (nextProps : PagePropTypes) {
    return (
      this.props.data !== nextProps.data ||
      this.props.isAdvicer !== nextProps.isAdvicer ||
      this.props.institutions !== nextProps.institutions
    );
  }

  render () {
    const {
      data,
      institutions,
      isAdvicer,
    } = this.props;

    const
      name = data.get("name"),
      authors = data.get("authors"),
      version = data.get("version"),
      advicers = data.get("advicers"),
      versions = data.get("versions"),
      date = data.get("date");

      // versions.filter((current) => (
      //   current.get("version") === version
      // ));

    const currentVersion = Immutable.List();

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
                    <div className="card my-4">
                      <div className="card-body">
                        <h4 className="card-title">{"Te rugăm să avizezi acest act normativ"}</h4>
                        <div className="card-text">
                          <AdviceForm />
                        </div>
                      </div>
                    </div>
                  ) : null
                }
              </div>
            </div>
            <div className="col-xl-4">
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
            <table className="table table-sm">
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
                          <td className="no-wrap small">{institutions.getIn([
                            advicer,
                            "name",
                          ])}
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
                          {currentInstitution.get("institutionName")}
                        </td>
                        <td className="no-wrap">{currentInstitution.get("status")}</td>
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
