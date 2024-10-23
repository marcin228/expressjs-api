"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secretKey = process.env.SECRET_KEY;
const jwt = {
  generateToken: (payload) => {
    const options = { expiresIn: "24h" };
    const token = jsonwebtoken_1.default.sign({ payload }, secretKey, options);
    return token;
  },
  verifyToken: (token) => {
    let result = false;
    try {
      result = jsonwebtoken_1.default.verify(token, secretKey);
    } catch (err) {
      if (err instanceof Error) console.log(err);
      result = false;
    }
    return result;
  },
};
module.exports = jwt;
