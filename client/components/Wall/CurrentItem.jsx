// @flow

import type { State } from "types";

type CurrentItemPropTypes = {
  account: any;
  item: any;
  isPublicAccount: bool;
};

import React from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

import { Optiune } from "./Optiuni";
import Details from "./Details";

import { getItem, getSelectedItem, getCurrentAccount, getIsPublicAccount } from "reducers";

const
  mapStateToProps = (state : State) => {
    const selected = getSelectedItem(state);

    return {
      item            : getItem(state, selected),
      account         : getCurrentAccount(state),
      isPublicAccount : getIsPublicAccount(state),
    };
  };

class CurrentItem extends React.Component {
  props: CurrentItemPropTypes;

  shouldComponentUpdate (nextProps : CurrentItemPropTypes) {
    return (
      this.props.isPublicAccount !== nextProps.isPublicAccount ||
      this.props.account !== nextProps.account ||
      this.props.item !== nextProps.item
    );
  }

  render () {
    const
      { item, account, isPublicAccount } = this.props;

    if (typeof item === "undefined") {
      return (
        <div className="text-center display-4 mt-4">
          {"Nu este ales niciun proiect încă"}
          {
            isPublicAccount ? null : (
              <span>
                {". Vizualizați "}
                <Link to="/list">
                  {"Ordinea de zi"}
                </Link>
              </span>
            )
          }
        </div>
      );
    }

    const
      group = account.get("group");

    const
      id = item.get("_id"),
      project = item.get("project"),
      position = item.get("position"),
      title = item.get("title"),
      comment = item.get("comment"),
      hasComment = typeof comment !== "undefined" && comment !== "",
      groupOption = item.get(group);

    return (
      <div className="mt-lg-5 wall">
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="display-4 cursor-pointer custom-header">
                <span className="badge badge-pill badge-info">{position}</span>
                {" "}
                <Optiune content={project} inline optiune={groupOption} />
              </div>
              <div className={`lead-truncate${hasComment ? "" : "-full"} pt-2 lead`}>
                <div className={`ellipsis-big${hasComment ? "" : "-full"}`}>{title}</div>
              </div>
              {
                hasComment ? (
                  <div className="font-italic lead-truncate lead">
                    <hr />
                    <div className="ellipsis-big">{comment}</div>
                  </div>
                ) : null
              }
              <div className="mt-4 mt-md-1 h3 mt-lg-3">
                <Details data={item} group={group} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps)(CurrentItem));
