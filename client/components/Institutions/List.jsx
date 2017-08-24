// @flow

import type { Dispatch, State } from "types";

type ListPropTypes = {
  institutions: any;
  hasFetchingError: boolean;
  isFetching: boolean;
  shouldFetchInstitutions: boolean;
  info: any;

  showUsers: (id : string) => () => void;
  showModifyModal: (id : string) => () => void;
  showDeleteModal: (id : string) => () => void;
  fetchInstitutions: () => void;
  showCreateInstitutionModal: () => void;
};

import { connect } from "react-redux";
import React from "react";

import { LargeErrorMessage, LoadingMessage } from "../Messages";
import Row from "./Row";

import {
  fetchInstitutions as fetchInstitutionsAction,
  hideModal as hideModalAction,
  deleteInstitutionModal as deleteInstitutionAction,
  modifyInstitutionModal as modifyInstitutionAction,
  showUsersForInstitutionModal as showUsersForInstitutionModalAction,
} from "actions";

import {
  getInstitutionsHasError,
  getInstitutionsAreFetching,
  getInstitutionsShouldFetch,
  getInstitutions,
} from "reducers";

const
  mapStateToProps = (state : State) => ({
    institutions            : getInstitutions(state),
    isFetching              : getInstitutionsAreFetching(state),
    hasFetchingError        : getInstitutionsHasError(state),
    shouldFetchInstitutions : getInstitutionsShouldFetch(state),
  }),
  mapDispatchToProps = (dispatch : Dispatch) => ({
    fetchInstitutions () {
      setTimeout(() => {
        dispatch(fetchInstitutionsAction());
      });
    },
    showDeleteModal: (id : string) => () => {
      dispatch(deleteInstitutionAction(id));
    },
    showModifyModal: (id : string) => () => {
      dispatch(modifyInstitutionAction({
        id,
        cbAfter: () => {
          dispatch(hideModalAction());
        },
      }));
    },
    showUsers: (institutionID : string) => () => {
      dispatch(showUsersForInstitutionModalAction({
        institutionID,
      }));
    },
  });

class List extends React.Component {

  props: ListPropTypes;

  componentDidMount () {
    const { shouldFetchInstitutions, fetchInstitutions } = this.props;

    if (shouldFetchInstitutions) {
      fetchInstitutions();
    }
  }

  shouldComponentUpdate (nextProps : ListPropTypes) {
    return (
      nextProps.shouldFetchInstitutions !== this.props.shouldFetchInstitutions ||
      nextProps.hasFetchingError !== this.props.hasFetchingError ||
      nextProps.isFetching !== this.props.isFetching ||
      nextProps.institutions !== this.props.institutions
    );
  }

  render () {
    const {
      institutions,
      fetchInstitutions,
      hasFetchingError,
      isFetching,
      showModifyModal,
      showDeleteModal,
      showUsers,
    } = this.props;

    if (isFetching) {
      return <LoadingMessage message="Preiau instituțiile..." />;
    }

    if (hasFetchingError) {
      return (
        <LargeErrorMessage
          message="Nu am putut prelua instituțiile"
          onRetry={fetchInstitutions}
        />
      );
    }

    if (institutions.size === 0) {
      return (
        <div className="text-center h4">
          {"Nu există instituții"}
        </div>
      );
    }

    return (
      <div className="container">
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>
                  {"Denumire"}
                </th>
                <th className="text-center">
                  {"Modifică"}
                </th>
                <th className="text-center">
                  {"Șterge"}
                </th>
              </tr>
            </thead>
            <tbody>
              {
                institutions.map((institution) => (
                  <Row
                    data={institution}
                    deleteRow={showDeleteModal}
                    key={institution.get("_id")}
                    modifyRow={showModifyModal}
                    showUsers={showUsers}
                  />
                )
                )
              }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
