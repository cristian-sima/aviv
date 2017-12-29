// @flow

type ListPropTypes = {
  users: any;

  confirmReset: (id : string) => () => void;
  showModifyModal: (id : string) => () => void;
  showDeleteModal: (id : string) => () => void;
  showCreateUserModal: () => void;
};

import React from "react";
import { Button } from "reactstrap";

import Row from "./Row";

class List extends React.Component<ListPropTypes> {
  props: ListPropTypes;

  shouldComponentUpdate (nextProps : ListPropTypes) {
    return (
      this.props.users !== nextProps.users
    );
  }

  render () {
    const {
      users,
      showCreateUserModal,
      showDeleteModal,
      showModifyModal,
      confirmReset,
    } = this.props;

    return (
      <div>
        <div className="container">
          <div className="row mr-1 ">
            <div className="col-12 text-right">
              <Button
                className="mb-2"
                color="success"
                onClick={showCreateUserModal}>
                {"Utilizator nou"}
              </Button>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-striped table-hover table-sm users-list">
              <thead>
                <tr>
                  <th className="name-row no-wrap">
                    {"Nume și prenume"}
                  </th>
                  <th className="name-row">
                    {"Utilizator"}
                  </th>
                  <th className="name-row">
                    {"E-mail"}
                  </th>
                  <th className="name-row">
                    {"Telefon"}
                  </th>
                  <th className="name-row no-wrap">
                    {"Parolă temporară"}
                  </th>
                  <th className="text-center">
                    <i aria-hidden="true" className="fa fa-cog" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {
                  users.map((user) => (
                    <Row
                      confirmReset={confirmReset}
                      data={user}
                      key={user.get("_id")}
                      showDeleteModal={showDeleteModal}
                      showModifyModal={showModifyModal}
                    />
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default List;
