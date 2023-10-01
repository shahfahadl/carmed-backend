const userRouter = require('express').Router();
const userController = require('../controllers/user');
const authController = require('../controllers/auth');


const router = () => {
    userRouter.post('/', userController.createOrder);
    userRouter.put('/login', userController.loginUser);
    userRouter.post('/order', authController.validate, userController.createOrder);
    userRouter.post('/updateOrder', authController.validate, userController.updateOrder);
    userRouter.post('/cancel-order', authController.validate, userController.cancelOrder);
    userRouter.post('/accept-request', authController.validate, userController.acceptRequest);
    userRouter.post('/give-rating', authController.validate, userController.giveRating);
    userRouter.post('/generate-otp', userController.generateOTP);
    userRouter.post('/reset-password', userController.resetPassword);
    //admin
    userRouter.get('/get-all', authController.validate, userController.getAllOrders);
    userRouter.get('/get-users', authController.validate, userController.getAllUsers);
    userRouter.get('/get-vendors', authController.validate, userController.getAllVendors);
    userRouter.put('/update-user', authController.validate, userController.updateAccount)
    return userRouter;
};

module.exports = router;