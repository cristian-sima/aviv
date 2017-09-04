// @flow

import type { Dispatch, State, Suggestion } from "types";

type AutosuggestStatusPropTypes = {
  isError: boolean;
  isFetching: boolean;
};

type SearchContainerPropTypes = {
  term: string;
  isErrorFetchingSuggestions: boolean;
  isFetchingSuggestions: boolean;
  history: any;
  suggestions: any;

  changeSuggestionsCurrentTerm: (newTerm : string) => void;
  fetchSuggestions: (search : string) => void;
}

const
  maxSuggestions = 5,
  minLength = 3,
  timeoutDelay = 400,
  iStyle = {
    position   : "absolute",
    right      : 8,
    top        : 12,
    transition : "all .2s ease-in-out",
  },
  theme = {
    container             : "special-container",
    input                 : "special-search-input form-control",
    suggestion            : "list-group-item suggestion-item",
    suggestionHighlighted : "list-group-item active",
    suggestionsContainer  : "suggestions-company-container",
  };

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Autosuggest from "react-autosuggest";
import React from "react";

import {
  changeSuggestionsCurrentTerm as changeSuggestionsCurrentTermAction,
  fetchSuggestions as fetchSuggestionsAction,
} from "actions";

import {
  getSuggestionsHaveError,
  getSuggestionsAreFetching,
  getSuggestionsByCurrentTerm,
} from "reducers";

const
  getSuggestionValue = (term : string) => () => (
    String(term).
      trim().
      toLowerCase()
  ),
  renderSuggestion = ({ name } : Suggestion, { query }) => {

    const
      position = name.indexOf(query),
      charsToShow = 190;

    const start = position - charsToShow < 0 ? 0 : position - charsToShow;

    const end = position + charsToShow + query.length > name.length ? name.length : (
      position + charsToShow + query.length
    );

    const startDots = start === 0 ? "" : "...";
    const endDots = name.length === end ? "" : "...";

    return `${startDots}${name.substring(start, end)}${endDots}`;
  };

const AutosuggestStatus = ({ isError, isFetching } : AutosuggestStatusPropTypes) => {
  if (isError) {
    return (
      <i
        className="fa fa-exclamation-triangle text-warning"
        style={iStyle}
        title="Nu am putut prelua datele"
      />
    );
  }

  if (isFetching) {
    return (
      <i className="fa fa-cog fa-spin fa-fw" style={iStyle} />
    );
  }

  return null;
};

const mapStateToProps = (state : State) => ({
    term                       : state.suggestions.term,
    isErrorFetchingSuggestions : getSuggestionsHaveError(state),
    isFetchingSuggestions      : getSuggestionsAreFetching(state),
    suggestions                : getSuggestionsByCurrentTerm(state),
  }),
  mapDispatchToProps = (dispatch : Dispatch) => bindActionCreators({
    fetchSuggestions             : fetchSuggestionsAction,
    changeSuggestionsCurrentTerm : changeSuggestionsCurrentTermAction,
  }, dispatch);

class SearchContainer extends React.Component {

  props: SearchContainerPropTypes;

  onChange: (event: any, something : {newValue : string}) => void;
  handleFetchRequested: (something: {value : string}) => void;
  handleClearRequested: (something: {value : string}) => Array<Suggestion>;

  handleSuggestionSelected: (
    event: any,
    something : {suggestion: Suggestion}
  ) => void;

  constructor (props : SearchContainerPropTypes) {
    super(props);

    const { changeSuggestionsCurrentTerm } = this.props;

    let timeoutFetchSuggestions : any = false;

    this.onChange = (
      event : any,
      { newValue } : {newValue: string }
    ) => changeSuggestionsCurrentTerm(newValue);

    this.handleFetchRequested = ({ value } : {value : string }) => {

      const { fetchSuggestions, term } = this.props;

      const
        oldValue = (
          String(term).
            trim().
            toLowerCase()
        ),
        newValue = (
          String(value).
            trim().
            toLowerCase()
        ),
        theNewTermIsDifferent = (
          newValue !== oldValue
        ),
        newValueIsNotEmpty = (newValue !== ""),
        shouldFetchSuggestions = (
          theNewTermIsDifferent &&
          newValueIsNotEmpty &&
          newValue.length >= minLength
        );

      if (shouldFetchSuggestions) {
        if (timeoutFetchSuggestions) {
          window.clearTimeout(timeoutFetchSuggestions);
        }

        timeoutFetchSuggestions = setTimeout(() => {
          window.clearTimeout(timeoutFetchSuggestions);
          fetchSuggestions(value);
        }, timeoutDelay);
      }
    };

    this.handleClearRequested = () => [];

    this.handleSuggestionSelected = (
      event : any,
      { suggestion : { _id } } : { suggestion : Suggestion }
    ) => {
      const { history } = props;

      history.push(`/items/${_id}`);
    };
  }

  shouldComponentUpdate (nextProps) {
    return (
      this.props.suggestions !== nextProps.suggestions ||
      this.props.term !== nextProps.term ||
      this.props.isFetchingSuggestions !== nextProps.isFetchingSuggestions ||
      this.props.isErrorFetchingSuggestions !== nextProps.isErrorFetchingSuggestions
    );
  }

  render () {
    const {
      isErrorFetchingSuggestions,
      isFetchingSuggestions,
      suggestions,
      term,
    } = this.props;

    const searchMessage = "Caută act normativ...",
      inputProps = {
        "aria-label"      : searchMessage,
        "aria-labelledby" : searchMessage,
        "onChange"        : this.onChange,
        "placeholder"     : searchMessage,
        "tabIndex"        : 0,
        "value"           : term,
      };

    return (
      <div style={{ position: "relative" }}>
        <Autosuggest
          focusInputOnSuggestionClick={false}
          getSuggestionValue={getSuggestionValue(term)}
          inputProps={inputProps}
          onSuggestionSelected={this.handleSuggestionSelected}
          onSuggestionsClearRequested={this.handleClearRequested}
          onSuggestionsFetchRequested={this.handleFetchRequested}
          renderSuggestion={renderSuggestion}
          suggestions={suggestions.slice(0, maxSuggestions)}
          theme={theme}
        />
        <AutosuggestStatus
          isError={isErrorFetchingSuggestions}
          isFetching={isFetchingSuggestions}
        />
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SearchContainer));
