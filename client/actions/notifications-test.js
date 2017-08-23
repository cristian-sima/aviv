

import { deleteNotification } from "./notifications";

describe("account/notifications actions", () => {
  it("should create an action to delete a notification", () => {
    const
      position = 72,
      expectedAction = {
        type    : "DELETE_NOTIFICATION",
        payload : position,
      };

    expect(deleteNotification(position)).toEqual(expectedAction);
  });
});
