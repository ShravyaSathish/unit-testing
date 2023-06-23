const app = require("../../../index");
const User = require("../../../models/user");
const bcrypt = require("bcrypt");
const generateToken = require("../../../utilss/generatetoken");
const login = require("../../../controllers/login");
const Token = require("../../../models/refreshToken");

jest.mock("../../../models/user.js", () => ({
  findOne: jest.fn(),
}));
jest.mock("bcrypt", () => ({
  compare: jest.fn(),
}));

describe("login", () => {
  let req;
  let res;
  const user = {
    _id: "64265b3290cb939d95be95ee",
    email: "s@gmail.com",
    password: "123",
  };

  beforeEach(() => {
    req = {
      body: { email: user.email, password: user.password },
    };
    res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should log in a user and return an access token", async () => {
    User.findOne.mockResolvedValue(user);
    bcrypt.compare.mockResolvedValue(true);
    console.log("Mocked user:", user);
    console.log("passssssssssss", true);
    await login(req, res);
    const token = await generateToken(user);
    console.log("11111111", token);
    console.log("Response JSON:", res.json.mock.calls[0][0]);

    expect(User.findOne).toHaveBeenCalledWith({ email: user.email });
    expect(bcrypt.compare).toHaveBeenCalledWith(user.password, user.password);
    expect(res.json).toHaveBeenCalledWith({
      access_token: token,
      message: "Login successful",
    });
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should return an error message when user is not found", async () => {
    User.findOne.mockResolvedValue(null);

    await login(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: user.email });
    expect(res.json).toHaveBeenCalledWith({ message: "No user found" });
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should return an error message when the password is invalid", async () => {
    User.findOne.mockResolvedValue(user);
    bcrypt.compare.mockResolvedValue(false);

    await login(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: user.email });
    expect(bcrypt.compare).toHaveBeenCalledWith(user.password, user.password);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid Password! Please try again",
    });
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should return an error message when an internal server error occurs", async () => {
    User.findOne.mockRejectedValue(new Error("Database error"));

    await login(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: user.email });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "internal server error" });
  });
});
