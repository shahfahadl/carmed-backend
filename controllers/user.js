const Validations = require("../validations");
const User = require("../services/user");
const s3 = require("../services/aws");
const fs = require('fs');

const uploadFileToS3 = async (file) => {
  try {
    const imagePath = file.path;

    const blob = fs.readFileSync(imagePath);

    const uploadedImage = await s3.upload({
      Bucket: process.env.BUCKET_NAME,
      Key: file.filename,
      Body: blob,
    }).promise();

    return uploadedImage;
  } catch (error) {
    return null;
  }
}

const createUser = async (req, res, next) => {

  try {
    const data = await Validations.user.userCreation(
      req.body,
    );

    const response = await User.createUser(data);

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const data = await Validations.user.userLogin(
      req.body,
    );

    const response = await User.loginUser(data);
    if (!!response?.blocked) {
      const error = new Error("User Blocked");
      error.status = 405;
      error.code = "blocked";
      throw error;
    }

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

const createOrder = async (req, res, next) => {
  try {
    const data = req.body

    const response = User.createOrder(data)

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

const updateOrder = async (req, res, next) => {
  try {
    const data = req.body

    const response = User.updateOrder(data)

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

const cancelOrder = async (req, res, next) => {
  try {
    const data = req.body

    const response = User.cancelOrder(data)

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

const acceptRequest = async (req, res, next) => {
  try {
    const data = req.body

    const response = User.acceptRequest(data)

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

const giveRating = async (req, res, next) => {
  try {
    const data = req.body

    const response = User.giveRating(data)

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

const generateOTP = async (req, res, next) => {
  const mail = req.body.email;
  try {
    await User.generateOTP(mail);
    res.status(200).json('OTP sent');
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  const mail = req.body.email;
  try {
    await User.resetPassword(mail);
    res.status(200).json('Password Resetted');
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {

  try {
    const orders = await User.getAllOrders();
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {

  try {
    const orders = await User.getAllUsers();
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

const getAllVendors = async (req, res, next) => {

  try {
    const orders = await User.getAllVendors();
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

const updateAccount = async (req, res, next) => {

  try {
    const orders = await User.updateUser(req.body);
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  loginUser,
  createOrder,
  cancelOrder,
  acceptRequest,
  giveRating,
  updateOrder,
  generateOTP,
  resetPassword,
  getAllOrders,
  getAllUsers,
  getAllVendors,
  updateAccount
}