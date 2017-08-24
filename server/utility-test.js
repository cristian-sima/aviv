import { isSpecialAccount, isNormalUser } from "./utility";

describe("isSpecialAccount", () => {
  describe("given the username 0", () => {
    it("detects a special account", () => {
      const username = 0;

      expect(isSpecialAccount(username)).toEqual(true);
    });
  });
  describe("given the username 999", () => {
    it("detects a special account", () => {
      const username = 999;

      expect(isSpecialAccount(username)).toEqual(true);
    });
  });
  describe("given any other number is not", () => {
    it("detects a normal account", () => {
      const username = 221;

      expect(isSpecialAccount(username)).toEqual(false);
    });
  });
});

describe("isNormalUser", () => {
  describe("given the username 0", () => {
    it("detects a special account", () => {
      const username = 0;

      expect(isNormalUser(username)).toEqual(false);
    });
  });
  describe("given the username 999", () => {
    it("detects a special account", () => {
      const username = 999;

      expect(isNormalUser(username)).toEqual(false);
    });
  });
  describe("given any other number is not", () => {
    it("detects a normal account", () => {
      const username = 221;

      expect(isNormalUser(username)).toEqual(true);
    });
  });
});
