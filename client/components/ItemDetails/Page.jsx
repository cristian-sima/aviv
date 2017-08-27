// @flow

import React from "react";
import moment from "moment";

import AdviceForm from "./AdviceForm";

type PagePropTypes = {
  data: any;
  institutions: any;
};

class Page extends React.Component {
  props: PagePropTypes;

  shouldComponentUpdate (nextProps : PagePropTypes) {
    return (
      this.props.data !== nextProps.data ||
      this.props.institutions !== nextProps.institutions
    );
  }

  render () {
    const { data, institutions } = this.props;

    const
      name = data.get("name"),
      authors = data.get("authors"),
      version = data.get("version"),
      date = data.get("date");

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
                <div className="card my-4">
                  <div className="card-body">
                    <h4 className="card-title">{"Te rugăm să avizezi acest act normativ"}</h4>
                    <div className="card-text">
                      <AdviceForm />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4">
              <span className="text-muted">
                {"Data publicării: "}
              </span>
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
        </div>
      </div>
    );
  }
}

export default Page;
