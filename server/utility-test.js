import { isMasterAccount, isNormalUser } from "./utility";

describe("isMasterAccount", () => {
  describe("given the username 0", () => {
    it("detects a special account", () => {
      const username = "0";

      expect(isMasterAccount(username)).toEqual(false);
    });
  });
  describe("given the username MASTER", () => {
    it("detects a special account", () => {
      const username = "MASTER";

      expect(isMasterAccount(username)).toEqual(true);
    });
  });
});

describe("isNormalUser", () => {
  describe("given the username 0", () => {
    it("detects a special account", () => {
      const username = "0";

      expect(isNormalUser(username)).toEqual(true);
    });
  });
  describe("given the username MASTER", () => {
    it("detects a special account", () => {
      const username = "MASTER";

      expect(isNormalUser(username)).toEqual(false);
    });
  });
});
