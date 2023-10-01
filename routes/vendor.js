const vendorRouter = require('express').Router();
const vendorController = require('../controllers/vendor');
const authController = require('../controllers/auth');

const router = () => {
    vendorRouter.post('/', vendorController.createVendor);
    vendorRouter.put('/login', vendorController.loginVendor);
    vendorRouter.post('/accept-order', authController.validate, vendorController.acceptOrder);
    vendorRouter.post('/complete-order', authController.validate, vendorController.completeOrder);
    vendorRouter.post('/cancel-order', authController.validate, vendorController.cancelOrder);
    vendorRouter.post('/place-bid', authController.validate, vendorController.placeBid);
    return vendorRouter;
};

module.exports = router;