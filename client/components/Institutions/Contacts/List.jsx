// @flow

type ListPropTypes = {
  users: any;
};

import React from "react";

import Row from "./Row";

class List extends React.Component<ListPropTypes> {
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
      <table className="table table-responsive table-striped table-hover table-sm mt-3 users-list">
        <thead>
          <tr>
            <th className="name-row no-wrap">
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
    );
  }
}

export default List;
