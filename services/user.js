const prisma = require("../database/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { firebaseConstants } = require("../static/constants");
const { db } = require("./firebase");
const otpService = require("./otp");
const mailService = require("./mail");
const htmlTemplate = require("./email");

const createUser = async (user = {}) => {
  const otpValidated = await otpService.validateToken(user.otp);
  
  if(otpValidated === null){
    return null
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      email: user.email,
    },
  });

  const existingVendor = await prisma.vendor.findFirst({
    where: {
      email: user.email,
    },
  });

  if (existingUser || existingVendor) return { error: "user already exist" }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(user.password, salt);
  const createdUser = await prisma.user.create({
    data: {
      name: user.name,
      email: user.email,
      password: hashedPassword,
      cnic: user.cnic,
      gender: user.gender,
      profile: user.profile,
      contact: user.contact
    },
  });

  const token = jwt.sign({ _id: createdUser._id }, process.env.TOKEN_SECRET);

  return {
    ...createdUser,
    type: "user",
    token,
  };
};

const loginUser = async (user = {}) => {
  const emailExist = await prisma.user.findFirst({
    where: { email: user.email },
  });

  if (!emailExist) return null;
  const validPass = await bcrypt.compare(user.password, emailExist?.password);

  if (!validPass) return null;

  const token = jwt.sign({ _id: emailExist._id }, process.env.TOKEN_SECRET);

  return {
    ...emailExist,
    type: "user",
    token,
  };
};

const createOrder = async (order) => {
  const createdOrder = await prisma.order.create({
    data: {
      ...order,
      status: "pending",
      vendorName: "null",
      vendorId: "null",
      vendorProfile: "",
      vendorContact: "",
      rating: 0,
      review: "",
      time: order.time || '',
      date: order.date || ''
    },
  });

  const dbOrder = await db.collection(firebaseConstants.orders).add({
    bid: createdOrder.bid,
    requests: createdOrder.requests,
    problem: createdOrder.problem,
    carType: createdOrder.carType,
    location: createdOrder.location,
    userId: createdOrder.userId,
    userName: createdOrder.userName,
    status: createdOrder.status,
    vendorId: createdOrder.vendorId,
    vendorName: createdOrder.vendorName,
    rating: createdOrder.rating,
    review: createdOrder.review,
    userProfile: createdOrder.userProfile,
    vendorProfile: createdOrder.vendorProfile,
    latLng: createdOrder.latLng,
    contact: createdOrder.contact,
    date: createdOrder.date,
    time: createdOrder.time
  });

  return dbOrder.id;
};

const updateOrder = async (order) => {
  const dbOrder = await db
    .collection(firebaseConstants.orders)
    .doc(order.id)
    .update({
      bid: order.bid,
      carType: order.carType,
      location: order.location,
      latLng: order.latLng || {},
      problem: order.problem,
      date: order.date || "",
      time: order.time || "",
    });

  return dbOrder.id;
};

const cancelOrder = async (order) => {
  const dbOrder = await db
    .collection(firebaseConstants.orders)
    .doc(order.id)
    .update({
      status: "canceled",
    });

  return dbOrder.id;
};

const acceptRequest = async (order) => {
  const dbOrder = await db
    .collection(firebaseConstants.orders)
    .doc(order.id)
    .update({
      status: "process",
      vendorId: order.vendorId,
      vendorName: order.vendorName,
      vendorProfile: order.vendorProfile,
      vendorContact: order.vendorContact,
      bid: order.bid,
    });

  return dbOrder.id;
};

const giveRating = async (order) => {
  const vendor = await prisma.vendor.findFirst({
    where: { id: order.vendorId },
  });

  const updatedVendor = await prisma.vendor.update({
    where: { id: order.vendorId },
    data: {
      ratings: [
        ...vendor.ratings,
        { rating: order.rating, review: order.review ? order.review : "" },
      ],
    },
  });

  db.collection(firebaseConstants.orders)
    .doc(order.id)
    .update({
      rating: order.rating,
      review: order.review ? order.review : "",
    });

  return updatedVendor.id;
};

const generateOTP = async (mail) => {
  const otp = otpService.generateToken();
  const html = htmlTemplate.emailTemplate(`
    Hope this email finds you well<br/>This is your OTP <b>${otp}</b> for carmed!
  `)
  mailService.sendEmail(html, mail, "CarMed OTP");
  return otp;
};

function generateRandomPassword(length) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
}

const resetPassword = async (mail) => {

  const randomPassword = generateRandomPassword(8);
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(randomPassword, salt);

  const userExist = await prisma.user.findFirst({
    where: { email: mail },
  });

  if(userExist){
    delete userExist.id

    await prisma.user.update({
      where: {email: mail},
      data: {
        ...userExist,
        password: hashedPassword
      }
    })
  }

  const vendorExist = await prisma.vendor.findFirst({
    where: { email: mail },
  });

  if(vendorExist){
    delete vendorExist.id
    await prisma.vendor.update({
      where: {email: mail},
      data: {
        ...vendorExist,
        password: hashedPassword
      }
    })
  }

  if(!vendorExist && !userExist){
    return null;
  }

  const html = htmlTemplate.emailTemplate(`
    It happens to best of us<br/>
    Password has been resetted for your e-mail ${mail}<br/>
    <br/>
    your new password is <b>${randomPassword}</b>
  `)
  mailService.sendEmail(html, mail, "CarMed Reset Password");
  return userExist || vendorExist;
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
  resetPassword
};
