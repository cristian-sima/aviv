// @flow

type ListPropTypes = {
  users: any;
};

import React from "react";

import Row from "./Row";

class List extends React.Component {
  props: ListPropTypes;

  shouldComponentUpdate (nextProps : ListPropTypes) {
    return (
      this.props.users !== nextProps.users
    );
  }

  render () {
    const { users } = this.props;

    if (users.size === 0) {
      return (
        <div className="fancy-text my-5">
          {"Nu există informații de contact"}
        </div>
      );
    }

    return (
      <div className="table-responsive mt-3">
        <table className="table table-striped table-hover table-sm users-list">
          <thead>
            <tr>
              <th className="name-row">
                {"Nume și prenume"}
              </th>
              <th className="name-row">
                {"E-mail"}
              </th>
              <th className="name-row">
                {"Telefon"}
              </th>
            </tr>
          </thead>
          <tbody>
            {
              users.map((user) => (
                <Row
                  data={user}
                  key={user.get("_id")}
                />
              ))
            }
          </tbody>
        </table>
      </div>
    );
  }
}

export default List;
