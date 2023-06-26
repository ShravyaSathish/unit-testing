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
    _id: "64265b3290cb939d95be9533",
    email: "srrr@gmail.com",
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
    // console.log("Mocked user:", user);
    // console.log("passssssssssss", true);
    await login(req, res);
    const token = await generateToken(user);
    // console.log("11111111", token);
    // console.log("Response JSON:", res.json.mock.calls[0][0]);

    expect(User.findOne).toHaveBeenCalledWith({ email: user.email });
    expect(bcrypt.compare).toHaveBeenCalledWith(user.password, user.password);
    expect(res.json).toHaveBeenCalledWith({
      access_token: token,
      message: "Login successful",
    });
    expect(res.status).not.toHaveBeenCalled();
  });

  // it("should log in a user and return an access token", async () => {
  //   User.findOne.mockResolvedValue(user);
  //   bcrypt.compare.mockResolvedValue(true);
  //   console.log("Mocked user:", user);
  //   console.log("passssssssssss", true);
  //   await login(req, res);
  //   const token = await generateToken(user);
  //   console.log("11111111", token);
  //   console.log("Response JSON:", res.json.mock.calls[0][0]);

  //   expect(User.findOne).toHaveBeenCalledWith({ email: user.email });
  //   expect(bcrypt.compare).toHaveBeenCalledWith(user.password, user.password);
  //   expect(res.json).toHaveBeenCalledWith({
  //     access_token: token,
  //     message: "Login successful",
  //   });
  //   expect(res.status).not.toHaveBeenCalled();
  // });

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

const User = require("../models/User");
const bcrypt = require("bcrypt");
const { generateToken } = require("../helpers/tokenHelper");
const loginController = require("../controllers/login");

describe("Login API", () => {
  let req, res, findOneSpy, compareSpy, generateTokenSpy;

  beforeEach(() => {
    req = {
      body: {
        email: "test@example.com",
        password: "password123",
      },
    };

    res = {
      json: jasmine.createSpy("json"),
      status: jasmine
        .createSpy("status")
        .and.returnValue({ json: jasmine.createSpy("json") }),
    };

    findOneSpy = spyOn(User, "findOne");
    compareSpy = spyOn(bcrypt, "compare");
    generateTokenSpy = spyOn(loginController, "generateToken");
  });

  it('should return "No user found" message if user is not found', async () => {
    findOneSpy.and.returnValue(null);

    await loginController.login(req, res);

    expect(findOneSpy).toHaveBeenCalledWith({ email: req.body.email });
    expect(res.json).toHaveBeenCalledWith({ message: "No user found" });
  });

  it('should return "Login successful" message and access token if password is valid', async () => {
    const user = {
      email: "test@example.com",
      password: await bcrypt.hash("password123", 10),
    };
    findOneSpy.and.returnValue(user);
    compareSpy.and.returnValue(true);
    generateTokenSpy.and.returnValue("access_token");

    await loginController.login(req, res);

    expect(findOneSpy).toHaveBeenCalledWith({ email: req.body.email });
    expect(compareSpy).toHaveBeenCalledWith(req.body.password, user.password);
    expect(generateTokenSpy).toHaveBeenCalledWith(user);
    expect(res.json).toHaveBeenCalledWith({
      access_token: "access_token",
      message: "Login successful",
    });
  });

  it('should return "Invalid Password! Please try again" message if password is invalid', async () => {
    const user = {
      email: "test@example.com",
      password: await bcrypt.hash("password123", 10),
    };
    findOneSpy.and.returnValue(user);
    compareSpy.and.returnValue(false);

    await loginController.login(req, res);

    expect(findOneSpy).toHaveBeenCalledWith({ email: req.body.email });
    expect(compareSpy).toHaveBeenCalledWith(req.body.password, user.password);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid Password! Please try again",
    });
  });

  it('should return "internal server error" message if an error occurs', async () => {
    findOneSpy.and.throwError("Some error message");

    await loginController.login(req, res);

    expect(findOneSpy).toHaveBeenCalledWith({ email: req.body.email });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "internal server error" });
  });
});
