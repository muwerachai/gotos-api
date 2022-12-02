const { User } = require("../models");
const createError = require("../utils/createError");
const validator = require("validator");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      createError("This account is not found on server", 400);
    }
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};

exports.getProfileById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({
      where: { id: userId },
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      createError("This account is not found on server", 400);
    }
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const {  aboutMe } = req.body;
    if (!aboutMe && !req.file) {
      createError('aboutMe or profilePic is required', 400);
    }
   
    console.log(req)
    const updateValue = {};
    if (req.file) {
      const result = await cloudinary.upload(req.file.path);
      if (req.user.profilePic) {
        const splited = req.user.profilePic.split('/');
        const publicId = splited[splited.length - 1].split('.')[0];
        await cloudinary.destroy(publicId);
      }
      updateValue.profilePic = result.secure_url;
    }
    if (aboutMe) {
      updateValue.aboutMe = aboutMe;
    }
    await User.update(updateValue, { where: { id: req.user.id } });
    res.json(updateValue);
  } catch (err) {
    next(err);
  } finally {
    fs.unlinkSync(req.file.path);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const user = await User.findOne({ where: { id: req.user.id } });
    if (!oldPassword) {
      createError("password is require", 400);
    }
    if (!newPassword) {
      createError("new password is require", 400);
    }
    if (!confirmPassword) {
      createError("confirm password is require", 400);
    }
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      createError("wrong password", 400);
    }
    let letter = [];
    let number = [];
    for (let character of newPassword) {
      if (validator.isAlpha(character)) {
        letter.push(validator.isUppercase(character));
      }
      if (validator.isNumeric(character)) {
        number.push(character);
      }
    }
    const isCorrectPassword = letter.includes(true) && number.length !== 0;
    if (!isCorrectPassword) {
      createError(
        "Must have at least 8 characters, contains 1 capital letter, lower case letter and number",
        400
      );
    }
    if (newPassword !== confirmPassword) {
      createError("password is not match", 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.update(
      { password: hashedPassword },
      { where: { id: req.user.id } }
    );

    res.status(200).json({ message: "update password success" });
  } catch (err) {
    next(err);
  }
};

exports.getBlogUser = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};