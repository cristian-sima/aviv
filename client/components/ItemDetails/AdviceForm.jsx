// @flow

import React from "react";

type AdviceFormPropTypes = {

};

class AdviceForm extends React.Component {
  props: AdviceFormPropTypes;
  //
  // shouldComponentUpdate (nextProps : AdviceFormPropTypes) {
  //   // return (
  //   //   this.props. !== nextProps. ||
  //   // );
  // }

  render () {
    // const { } = this.props;

    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-8 col-md-6 col-lg-4 col-xl-6 offset-md-2">
            <div>
              <label className="custom-control custom-radio">
                <input className="custom-control-input" id="radio1" name="radio" type="radio" />
                <span className="custom-control-indicator" />
                <span className="custom-control-description">{"Favorabil, fără observații"}</span>
              </label>
            </div>
            <div>
              <label className="custom-control custom-radio">
                <input className="custom-control-input" id="radio2" name="radio" type="radio" />
                <span className="custom-control-indicator" />
                <span className="custom-control-description">{"Favorabil, cu observații"}</span>
              </label>
            </div>
            <div>
              <label className="custom-control custom-radio">
                <input className="custom-control-input" id="radio2" name="radio" type="radio" />
                <span className="custom-control-indicator" />
                <span className="custom-control-description">{"Negativ, cu observații"}</span>
              </label>
            </div>
          </div>
          <div className="col-sm-2 mt-4 text-center text-md-left">
            <button className="btn btn-primary">
              {"Trimite aviz"}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default AdviceForm;
