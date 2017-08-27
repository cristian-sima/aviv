// @flow

import React from "react";
import moment from "moment";

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
            <div className="col-xl-9">
              <div>
                <h5>{name}</h5>
                <hr />
                <span className="fancy-text">
                  {"Avizele curente"}
                </span>
              </div>
            </div>
            <div className="col-xl-3">
              <span className="text-muted">
                {"Data publicării:"}
              </span>
              <br />
              {moment(date).format("lll") }
              <hr />
              {"Versiunea:"}
              <span className="badge badge-pill badge-primary ml-1">
                {version}
              </span>
              <hr />
              {"Inițiatori:"}
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
