

import { changeSuggestionsCurrentTerm } from "./suggestions";

describe("account/suggestions actions", () => {
  it("should create an action to change the current term for suggestions", () => {
    const
      term = "Comp",
      expectedAction = {
        type    : "CHANGE_SUGGESTIONS_CURRENT_TERM",
        payload : term,
      };

    expect(changeSuggestionsCurrentTerm(term)).toEqual(expectedAction);
  });
});
