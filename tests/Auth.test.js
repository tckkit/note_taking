const users = {
  user1: "pw1",
  user2: "pw2",
};

describe("Testing on Auth", () => {
  const authChallenger = require("../AuthChallenger")(users);

  test("Check if input an incorrect username and password would return false", function () {
    expect(authChallenger("user3", "pw3")).toBe(false);
  });

  test("Check if input null would return false", function () {
    expect(authChallenger(null, null)).toBe(false);
  });

  test("Check if undefined input would return false", function () {
    expect(authChallenger()).toBe(false);
  });

  test("Check if input correct username but incorrect password would return false", function () {
    expect(authChallenger("user1", "pw3")).toBe(false);
  });

  test("Check if input incorrect username but correct password would return false", function () {
    expect(authChallenger("user3", users["user1"])).toBe(false);
  });

  test("Check if input correct username and password would return true", function () {
    expect(authChallenger("user1", users["user1"])).toBe(true);
  });
});
