const login = require("../controllers/login");
const app = require("../index");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const generateToken = require("../utilss/generatetoken");
const token = require("../models/refreshToken");

describe("Server", () => {
  describe("Login API", () => {
    let req, res, findOne, compare;
    const user = {
      _id: "6399aefb2be64637bacb2f02",
      email: "test@gmail.com",
      password: "123",
    };
    beforeEach(() => {
      req = {
        body: { email: user.email, password: user.password },
      };

      res = {
        json: jasmine.createSpy("json"),

        status: jasmine
          .createSpy("status")
          .and.returnValue({ json: jasmine.createSpy("json") }),
      };

      findOne = spyOn(User, "findOne");
      compare = spyOn(bcrypt, "compare");
    });
    it("it should return no user found", async () => {
      findOne.and.returnValue(null);
      await login(req, res);
      expect(findOne).toHaveBeenCalledWith({ email: req.body.email });
      expect(res.json).toHaveBeenCalledWith({ message: "No user found" });
    });

    it("should return Login successful and access token if password is valid", async () => {
      findOne.and.returnValue(user);
      compare.and.returnValue(true);
      await login(req, res);
      const token = await generateToken(user, req.body.email);
      expect(findOne).toHaveBeenCalledWith({ email: req.body.email });
      expect(compare).toHaveBeenCalledWith(req.body.password, user.password);
      expect(res.json).toHaveBeenCalledWith({
        access_token: token,
        message: "Login successful",
      });
    });
    it("should return Invalid password", async () => {
      findOne.and.returnValue(user);
      compare.and.returnValue(false);

      await login(req, res);

      expect(findOne).toHaveBeenCalledWith({ email: user.email });
      expect(compare).toHaveBeenCalledWith(req.body.password, user.password);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid Password! Please try again",
      });
    });

    it("should return an error message when an internal server error occurs", async () => {
      findOne.and.throwError("internal server error");

      await login(req, res);

      expect(findOne).toHaveBeenCalledWith({ email: user.email });
      // expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "internal server error",
      });
    });
  });
});
