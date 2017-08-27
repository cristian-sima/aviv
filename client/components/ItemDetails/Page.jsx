// @flow

import React from "react";

type PagePropTypes = {

};

class Page extends React.Component {
  props: PagePropTypes;

  // shouldComponentUpdate (nextProps : PagePropTypes) {
  //   // return (
  //   //   this.props. !== nextProps. ||
  //   // );
  // }

  render () {
    // const { } = this.props;

    return (
      <div>
        {"This is the page"}
      </div>
    );
  }
}

export default Page;
