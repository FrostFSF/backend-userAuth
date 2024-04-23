import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import mongoose from "mongoose";
import cors from "cors";
import jwt from 'jsonwebtoken';
dotenv.config();

//Importing all schemas
import User from "../Schema/User.js";

const server = express();
const PORT = process.env.PORT;
server.use(express.json());
server.use(cors());

mongoose.connect(process.env.MONGOOSE_URI, {
  autoIndex: true,
});

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

const generateUsername = async (email) => {
  let username = email.split("@")[0];

  await User.findOne({ "personal_info.username": username }).then((result) => {
    result ? (username += nanoid().substring(0, 5)) : "";
  });
  return username;
};

const formattedData = (user) => {
    let access_token = jwt.sign({ id: user._id }, process.env.SIGN_SECRET_KEY);

    return {
        access_token,
        profile_img: user.personal_info.profile_img,
        username: user.personal_info.username,
        fullname: user.personal_info.fullname
    }
}

server.post("/signup", (req, res) => {
  let { fullname, email, password } = req.body;

  if (!fullname) {
    return res.status(403).json({ error: "Fullname is reuqired" });
  }
  if (fullname.split(" ").length < 2) {
    return res
      .status(403)
      .json({ error: "Fullname must contain firstname and lastname" });
  }
  if (!emailRegex.test(email)) {
    return res.status(403).json({ error: "Email is not valid" });
  }
  if (!passwordRegex.test(password)) {
    return res.status(403).json({
      error:
        "Password must contain atleast 1 Captial Letter, 1 Number and 6-20 characters",
    });
  }

  bcrypt.hash(password, 10, async (err, hashed_password) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Some internal server issue happended during signup!" });
    } else {
      let username = await generateUsername(email);

      let user = new User({
        personal_info: {
          username,
          email,
          fullname,
          password: hashed_password,
        },
      });

      user
        .save()
        .then((u) => {
          return res.status(200).json(formattedData(u));
        })
        .catch((err) => {
          if (err.code === 11000) {
            return res.status(403).json({ error: "Email already registered" });
          } else {
            return res.status(500).json({ error: err.message });
          }
        });
    }
  });
});

server.post("/signin", async (req, res) => {
  let { email, password } = req.body;

  await User.findOne({ "personal_info.email": email }).then((results) => {
    if (!results) {
      return res.status(403).json({ error: "Email not registered yet" });
    } else {
      bcrypt.compare(
        password,
        results.personal_info.password,
        (err, passwordConfirmation) => {
          if (err) {
            return res
              .status(403)
              .json({ error: "Issue happended during password compare" });
          }

          if (passwordConfirmation) {
            return res.status(200).json(formattedData(results));
          } else {
            return res.status(403).json({ error: "Passwords do not match!" });
          }
        }
      );
    }
  });
});

server.listen(PORT, () => {
  console.log(`Listening to port: ${PORT}`);
});
