/* eslint-disable no-undefined, no-magic-numbers, max-len */

import reducer from "./performAddIfNewer";

import * as Immutable from "immutable";

import { noError, noID, nothingFetched } from "utility";

const ifThereIsNothingFetched = () => {
  describe("if there is nothing fetched,", () => {

    it("should return the state", () => {
      expect(reducer({
        IDs      : Immutable.List(),
        error    : noError,
        fetched  : false,
        fetching : false,

        lastID   : noID,
        lastDate : nothingFetched,
        total    : nothingFetched,

        from           : 0,
        negativeOffset : 0,
      }, {})).toEqual({
        IDs      : Immutable.List(),
        error    : noError,
        fetched  : false,
        fetching : false,

        lastID   : noID,
        lastDate : nothingFetched,
        total    : nothingFetched,

        from           : 0,
        negativeOffset : 0,
      });
    });
  });
};

const ifAllAreFetched = () => {
  describe("if all are fetched,", () => {
    describe("if the total is 0", () => {
      it("adds the ID, increments the total and negativeOffset, sets the date and id to the current one", () => {
        const
          paginator = {
            IDs      : Immutable.List(),
            error    : noError,
            fetched  : true,
            fetching : false,

            lastID   : noID,
            lastDate : nothingFetched,
            total    : 0,

            from           : 0,
            negativeOffset : 0,
          },
          item = Immutable.Map({
            _id  : "13",
            date : 18,
          });

        expect(reducer(paginator, item)).toEqual({
          IDs      : Immutable.List(["13"]),
          error    : noError,
          fetched  : true,
          fetching : false,

          lastID   : "13",
          lastDate : 18,
          total    : 1,

          from           : 0,
          negativeOffset : 1,
        });
      });
    });
    describe("if the total is not 0", () => {
      describe("the current one is older then the last date", () => {
        it("adds the ID, increments the total and negativeOffset, sets the date and id to the current one", () => {
          const
            paginator = {
              IDs      : Immutable.List(["20"]),
              error    : noError,
              fetched  : true,
              fetching : false,

              lastID   : "20",
              lastDate : 20,
              total    : 1,

              from           : 0,
              negativeOffset : 1,
            },
            item = Immutable.Map({
              _id  : "13",
              date : 13,
            });

          expect(reducer(paginator, item)).toEqual({
            IDs: Immutable.List([
              "20",
              "13",
            ]),
            error    : noError,
            fetched  : true,
            fetching : false,

            lastID   : "13",
            lastDate : 13,
            total    : 2,

            from           : 0,
            negativeOffset : 2,
          });
        });
      });
      describe("the current one is not older then the last date", () => {
        it("adds the ID, increments the total and negativeOffset", () => {
          const
            paginator = {
              IDs      : Immutable.List(["20"]),
              error    : noError,
              fetched  : true,
              fetching : false,

              lastID   : "20",
              lastDate : 20,
              total    : 1,

              from           : 0,
              negativeOffset : 1,
            },
            item = Immutable.Map({
              _id  : "25",
              date : 25,
            });

          expect(reducer(paginator, item)).toEqual({
            IDs: Immutable.List([
              "20",
              "25",
            ]),
            error    : noError,
            fetched  : true,
            fetching : false,

            lastID   : "20",
            lastDate : 20,
            total    : 2,

            from           : 0,
            negativeOffset : 2,
          });
        });
      });
    });
  });
};

const ifSomeAreFetched = () => {
  describe("if some are feched and the current date is more recent", () => {
    it("adds the ID, increments the total and negativeOffset", () => {
      const
        paginator = {
          IDs      : Immutable.List(["20"]),
          error    : noError,
          fetched  : true,
          fetching : false,

          lastID   : "20",
          lastDate : 20,
          total    : 75,

          from           : 0,
          negativeOffset : 1,
        },
        item = Immutable.Map({
          _id  : "85",
          date : 85,
        });

      expect(reducer(paginator, item)).toEqual({
        IDs: Immutable.List([
          "20",
          "85",
        ]),
        error    : noError,
        fetched  : true,
        fetching : false,

        lastID   : "20",
        lastDate : 20,
        total    : 76,

        from           : 0,
        negativeOffset : 2,
      });
    });
  });
  describe("if some are not feched or the current date is not more recent", () => {
    it("returns the current state", () => {
      const
        paginator = {
          IDs      : Immutable.List(["20"]),
          error    : noError,
          fetched  : true,
          fetching : false,

          lastID   : "20",
          lastDate : 20,
          total    : 20,

          from           : 0,
          negativeOffset : 1,
        },
        item = Immutable.Map({
          _id  : "10",
          date : 10,
        });

      expect(reducer(paginator, item)).toEqual({
        IDs      : Immutable.List(["20"]),
        error    : noError,
        fetched  : true,
        fetching : false,

        lastID   : "20",
        lastDate : 20,
        total    : 20,

        from           : 0,
        negativeOffset : 1,
      });
    });
  });
};

describe("performAddIfNewer", () => {
  ifThereIsNothingFetched();
  ifAllAreFetched();
  ifSomeAreFetched();
});
