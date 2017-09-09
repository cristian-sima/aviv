/* eslint-disable no-undefined, no-magic-numbers */

import reducer, {
  getSuggestionsAreFetching,
  getSuggestionsHaveError,
  getSuggestionsByCurrentTerm,
} from "./suggestions";

import * as Immutable from "immutable";
import { noError } from "utility";

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
          name : "computer",
          _id  : 1,
        },
        {
          name : "company",
          _id  : 2,
        },
      ],
      initialState = {
        fetching: true,

        map: Immutable.Map({
          "old": [
            {
              name : "t company 1",
              _id  : 1,
            },
            {
              name : "t company 2",
              _id  : 2,
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
            name : "t company 1",
            _id  : 1,
          },
          {
            name : "t company 2",
            _id  : 2,
          },
        ],
        [term]: suggestions,
      }),
    });
  });

  // until here

  const actionsWhichClear = [
    "DELETE_ITEM",
    "ADD_ITEM_STARTED",
    "ADD_ITEM_TO_ADVICE",
    "RECONNECTING_LIVE",
    "SIGN_OFF_FULFILLED",
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
                _id  : 1,
                name : "Company",
              },
              {
                _id  : 2,
                name : "Covrig",
              },
            ],
            "co": [
              {
                _id  : 1,
                name : "Company",
              },
              {
                _id  : 2,
                name : "Covrig",
              },
            ],
          }),
        },
        result = reducer(initialState, { type: action });

      expect(result).toEqual({
        error    : noError,
        fetching : false,

        term: "co",

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
                    name: "amurg",
                  },
                ],
                "at": [
                  {
                    name: "atunci",
                  },
                ],
                "tx": [
                  {
                    name: "txaaa",
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
                    name: "amurg",
                  },
                ],
                "at": [
                  {
                    name: "atunci",
                  },
                ],
                "tx": [
                  {
                    name: "txaaa",
                  },
                ],
              }),
            },
          },
          result = getSuggestionsByCurrentTerm(state);

        expect(result).toEqual([
          {
            name: "amurg",
          },
        ]);
      });
    });
  });
});
