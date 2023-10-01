const awsRouter = require('express').Router();
const awsController = require('../controllers/aws');
const authController = require('../controllers/auth');

const router = () => {
    awsRouter.put('/get-signed-url', authController.validate, awsController.getSignedUrl);
    return awsRouter;
};

module.exports = router;