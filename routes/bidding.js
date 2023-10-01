const biddingRouter = require('express').Router();
const authController = require('../controllers/auth');
const biddingController = require('../controllers/bidding');

const router = () => {
    biddingRouter.post('/', authController.validate, biddingController.postAnOrder);
    return biddingRouter;
};

module.exports = router;