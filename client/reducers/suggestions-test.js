/* eslint-disable no-undefined, no-magic-numbers */

import reducer, {
  getSuggestionsAreFetching,
  getSuggestionsHaveError,
  getSuggestionsByCurrentTerm,
} from "./suggestions";

import * as Immutable from "immutable";
import { noError } from "utility/others";

import { changeSuggestionsCurrentTerm } from "actions";

describe("account/suggestions reducer", () => {

  it("should return the initial state", () => {
    expect(reducer(undefined, {})).toEqual({
      error    : noError,
      fetching : false,

      term: "",

      map: Immutable.Map(),
    });
  });

  it("handle CHANGE_SUGGESTIONS_CURRENT_TERM", () => {
    const
      initialState = {
        term: "",
      },
      result = reducer(initialState, changeSuggestionsCurrentTerm("the new term"));

    expect(result).toEqual({
      term: "the new term",
    });
  });

  it("handle FETCH_SUGGESTIONS_PENDING", () => {
    const
      initialState = {
        error    : "Problem",
        fetching : false,
      },
      result = reducer(initialState, { type: "FETCH_SUGGESTIONS_PENDING" });

    expect(result).toEqual({
      error    : noError,
      fetching : true,
    });
  });

  it("handle FETCH_SUGGESTIONS_REJECTED", () => {
    const
      initialState = {
        error    : noError,
        fetching : true,
      },
      result = reducer(initialState, {
        type    : "FETCH_SUGGESTIONS_REJECTED",
        payload : {
          error: "Problem",
        },
      });

    expect(result).toEqual({
      error    : "Problem",
      fetching : false,
    });
  });

  it("handle FETCH_SUGGESTIONS_FULFILLED", () => {
    const
      term = "the new term",
      suggestions = [
        {
          Name : "computer",
          ID   : 1,
        },
        {
          Name : "company",
          ID   : 2,
        },
      ],
      initialState = {
        fetching: true,

        map: Immutable.Map({
          "old": [
            {
              Name : "t company 1",
              ID   : 1,
            },
            {
              Name : "t company 2",
              ID   : 2,
            },
          ],
        }),
      },
      result = reducer(initialState, {
        type    : "FETCH_SUGGESTIONS_FULFILLED",
        payload : {
          Term        : term,
          Suggestions : suggestions,
        },
      });

    expect(result).toEqual({
      fetching: false,

      map: Immutable.Map({
        "old": [
          {
            Name : "t company 1",
            ID   : 1,
          },
          {
            Name : "t company 2",
            ID   : 2,
          },
        ],
        [term]: suggestions,
      }),
    });
  });

  // until here

  const actionsWhichClear = [
    "ADD_COMPANY",
    "DELETE_COMPANY",
    "MODIFY_CURRENT_COMPANY_INFO",
    "TOGGLE_COMPANY_STATE",
    "COMPANY_TOGGLE_MODULE_FULFILLED",
  ];

  for (const action of actionsWhichClear) {
    it(`handles ${action}`, () => {
      const
        initialState = {
          error    : "Problem",
          fetching : false,

          term: "co",

          map: Immutable.Map({
            "c": [
              {
                ID      : 1,
                Name    : "Company",
                Modules : "invoices",
              },
              {
                ID      : 2,
                Name    : "Covrig",
                Modules : "invoices",
              },
            ],
            "co": [
              {
                ID      : 1,
                Name    : "Company",
                Modules : "invoices",
              },
              {
                ID      : 2,
                Name    : "Covrig",
                Modules : "invoices",
              },
            ],
          }),
        },
        result = reducer(initialState, { type: action });

      expect(result).toEqual({
        error    : noError,
        fetching : false,

        term: "",

        map: Immutable.Map(),
      });
    });
  }
  it("getSuggestionsAreFetching", () => {
    const
      state = {
        suggestions: {
          fetching: true,
        },
      },
      result = getSuggestionsAreFetching(state);

    expect(result).toEqual(true);
  });

  describe("getSuggestionsHaveError", () => {
    it("detects errros", () => {
      const
        state = {
          suggestions: {
            error: "This is a problem",
          },
        };

      expect(getSuggestionsHaveError(state)).toEqual(true);
    });
    it("detects no errors", () => {
      const
        state = {
          suggestions: {
            error: noError,
          },
        };

      expect(getSuggestionsHaveError(state)).toEqual(false);
    });
  });
  describe("getSuggestionsByCurrentTerm", () => {
    describe("given there are no suggestions", () => {
      it("returns an empty array", () => {
        const
          state = {
            suggestions: {
              term : "  ty   ",
              map  : Immutable.Map({
                "am": [
                  {
                    Name: "amurg",
                  },
                ],
                "at": [
                  {
                    Name: "atunci",
                  },
                ],
                "tx": [
                  {
                    Name: "txaaa",
                  },
                ],
              }),
            },
          },
          result = getSuggestionsByCurrentTerm(state);

        expect(result).toEqual([]);
      });
    });
    describe("given there are suggestions", () => {
      it("returns the suggestions for the world without spaces and to lowercase ", () => {
        const
          state = {
            suggestions: {
              term : "  am   ",
              map  : Immutable.Map({
                "am": [
                  {
                    Name: "amurg",
                  },
                ],
                "at": [
                  {
                    Name: "atunci",
                  },
                ],
                "tx": [
                  {
                    Name: "txaaa",
                  },
                ],
              }),
            },
          },
          result = getSuggestionsByCurrentTerm(state);

        expect(result).toEqual([
          {
            Name: "amurg",
          },
        ]);
      });
    });
  });
});
