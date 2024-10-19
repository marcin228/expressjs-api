"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, "__esModule", { value: true });
(() =>
  __awaiter(void 0, void 0, void 0, function* () {
    const express = require("express");
    const sha1 = require("sha1");
    const { randomUUID } = require("crypto");
    const logger = require("./logger.js");
    const file = require("./file.js");
    const helpers = require("./helpers.js");
    const backup = require("./backup.js");
    const jwt = require("./jwt.js");
    const { eventEmitter, EVENTS } = require("./eventEmitter.js");
    require("./subscriber");
    const dotenv = require("dotenv");
    const app = express();
    dotenv.config();
    let packageJson;
    const loggerMiddleware = (req, res, next) => {
      logger.log(
        "info",
        `Incoming request, url ${req.url}, method: ${req.method}`
      );
      next();
    };
    const requestMiddleware = (req, res, next) => {
      const token =
        req.headers["authorization"] &&
        req.headers["authorization"].split(" ")[1];
      if (token) {
        res.locals.decoded = jwt.verifyToken(token);
        if (res.locals.decoded === false) {
          res.status(403).send("Unauthorized.");
          return;
        }
        next();
      } else res.status(403).send("No token provided.");
      return;
    };
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(loggerMiddleware);
    app.use("/posts", requestMiddleware);
    app.use("/user/profile", requestMiddleware);
    app.use("/user", requestMiddleware);
    app.use("/post", requestMiddleware);
    app.use("/posts", requestMiddleware);
    app.use("/posts/byTitle", requestMiddleware);
    try {
      packageJson = JSON.parse(yield file.read("../package", "json"));
    } catch (err) {
      if (err instanceof Error)
        logger.log("error", `Error reading package.json, ${err}`);
    }
    app.get("/health", (req, res) => {
      helpers.prepareStandardHeaders(res);
      res.status(200).send(JSON.stringify({ version: packageJson.version }));
      return;
    });
    // receiving :fname :lname :email :pass
    app.post("/user", (req, res) => {
      const incomingUser = {
        id: "",
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        pass: req.body.pass,
      };
      helpers.prepareStandardHeaders(res);
      if (!helpers.validateUser(incomingUser)) {
        res.status(400).send("Incorrect input data");
        return;
      }
      incomingUser.id = randomUUID();
      incomingUser.pass = sha1(incomingUser.pass);
      file.write(JSON.stringify(incomingUser), incomingUser.email, "json");
      res.status(201).send(JSON.stringify(incomingUser));
      return;
    });
    // receiving :email :pass
    app.post("/user/login", (req, res) =>
      __awaiter(void 0, void 0, void 0, function* () {
        const incomingUser = {
          email: req.body.email,
          pass: req.body.pass,
        };
        helpers.prepareStandardHeaders(res);
        if (!helpers.validateUser(incomingUser)) {
          res.status(400).send("Incorrect input data");
          return;
        }
        incomingUser.pass = sha1(incomingUser.pass);
        let userJson = { email: "", pass: "" };
        try {
          userJson = JSON.parse(yield file.read(incomingUser.email, "json"));
        } catch (err) {
          if (err instanceof Error)
            logger.log("error", `Error reading user file, ${err}`);
        }
        if (
          userJson.email == incomingUser.email &&
          userJson.pass == incomingUser.pass
        ) {
          const token = jwt.generateToken(userJson.email);
          res.set("Authorization", `Bearer ${token}`);
          res.status(200).send(JSON.stringify("User logged in."));
          return;
        }
        res.status(401).send("User NOT logged in.");
        return;
      })
    );
    app.get("/user/profile", (req, res) =>
      __awaiter(void 0, void 0, void 0, function* () {
        helpers.prepareStandardHeaders(res);
        const userFile = JSON.parse(
          yield file.read(res.locals.decoded.payload, "json")
        );
        res.status(200).send({
          name: userFile.fname,
          "last name": userFile.lname,
          email: userFile.email,
        });
        return;
      })
    );
    // receiving :fname :lname
    app.patch("/user", (req, res) =>
      __awaiter(void 0, void 0, void 0, function* () {
        helpers.prepareStandardHeaders(res);
        const incomingUser = {
          fname: req.body.fname,
          lname: req.body.lname,
        };
        if (!helpers.validateUser(incomingUser)) {
          res.status(400).send("Incorrect input data");
          return;
        }
        const userFile = JSON.parse(
          yield file.read(res.locals.decoded.payload, "json")
        );
        userFile.fname = incomingUser.fname;
        userFile.lname = incomingUser.lname;
        yield file.write(JSON.stringify(userFile), userFile.email, "json", "w");
        eventEmitter.emit(EVENTS.PROFILE_UPDATED, userFile);
        res.status(200).send("User updated.");
        return;
      })
    );
    // receiving :title :description :authorid
    app.post("/post", (req, res) =>
      __awaiter(void 0, void 0, void 0, function* () {
        helpers.prepareStandardHeaders(res);
        const incomingPost = {
          title: req.body.title,
          description: req.body.description,
          createdDate: new Date().toString(),
          authorId: req.body.authorid,
        };
        /* @TODO post data validation
        if (!helpers.validateUser(incomingUser)) {
          res.status(400).send("Incorrect input data");
          return;
        } */
        const postsFile = [
          ...JSON.parse(yield file.read("posts", "json")),
          incomingPost,
        ];
        yield file.write(JSON.stringify(postsFile), "posts", "json", "w");
        res.status(200).send("Post saved.");
        return;
      })
    );
    app.get("/posts", (req, res) =>
      __awaiter(void 0, void 0, void 0, function* () {
        helpers.prepareStandardHeaders(res);
        const postsFile = JSON.parse(yield file.read("posts", "json"));
        const userFile = JSON.parse(
          yield file.read(res.locals.decoded.payload, "json")
        );
        const tmp1 = postsFile.filter((el) => el.authorId == userFile.id);
        const tmp2 = tmp1.map((el) => {
          return {
            title: el.title,
            description: el.description,
            createdDate: el.createdDate,
            authorName: userFile.fname + " " + userFile.lname,
          };
        });
        const result = JSON.stringify(tmp2);
        res.status(200).send(result);
        return;
      })
    );
    app.delete("/posts", (req, res) =>
      __awaiter(void 0, void 0, void 0, function* () {
        helpers.prepareStandardHeaders(res);
        const postsFile = JSON.parse(yield file.read("posts", "json"));
        const userFile = JSON.parse(
          yield file.read(res.locals.decoded.payload, "json")
        );
        const result = JSON.stringify(
          postsFile.filter((el) => el.authorId != userFile.id)
        );
        yield file.write(JSON.stringify(result), "posts", "json", "w");
        res.status(200).send("All user's posts have been deleted.");
        return;
      })
    );
    app.delete("/posts/byTitle", (req, res) =>
      __awaiter(void 0, void 0, void 0, function* () {
        helpers.prepareStandardHeaders(res);
        const postsFile = JSON.parse(yield file.read("posts", "json"));
        const userFile = JSON.parse(
          yield file.read(res.locals.decoded.payload, "json")
        );
        const result = JSON.stringify(
          postsFile.filter(
            (el) => el.authorId != userFile.id && el.title != req.params.title
          )
        );
        yield file.write(JSON.stringify(result), "posts", "json", "w");
        res.status(200).send("Post deleted.");
        return;
      })
    );
    // receiving :title :description :createddate
    app.patch("/post", (req, res) =>
      __awaiter(void 0, void 0, void 0, function* () {
        helpers.prepareStandardHeaders(res);
        const incomingPost = {
          title: req.body.title,
          description: req.body.description,
          createdDate: req.body.createddate,
        };
        backup.write("posts", "json");
        const postsFile = JSON.parse(yield file.read("posts", "json"));
        const userFile = JSON.parse(
          yield file.read(res.locals.decoded.payload, "json")
        );
        const pos = postsFile.findIndex(
          (el) =>
            el.createdDate == incomingPost.createdDate &&
            el.authorId == userFile.id
        );
        postsFile[pos].title = incomingPost.title;
        postsFile[pos].description = incomingPost.description;
        postsFile[pos].createdDate = new Date().toString();
        yield file.write(JSON.stringify(postsFile), "posts", "json", "w");
        res.status(200).send("Post updated.");
        return;
      })
    );
    app.listen(parseInt(process.env.PORT || "3000"), "::1", () => {
      logger.log("info", `Server started - ${new Date().toUTCString()}`);
    });
  }))();
