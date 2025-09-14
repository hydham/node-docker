const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

exports.createUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      username,
      password: hashPassword,
    });

    req.session.user = { username: newUser.username };

    res.status(201).json({
      status: "success",
      user: newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "fail",
    });
  }
};

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "User not found",
      });
    }

    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) {
      return res.status(400).json({
        status: "fail",
        message: "Incorrect Password",
      });
    }

    req.session.user = { username: user.username };

    res.status(200).json({
      status: "success",
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: false,
    });
  }
};
