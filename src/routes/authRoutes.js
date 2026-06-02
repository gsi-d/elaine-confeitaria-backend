const authController = require('../controllers/authController');
const createAuthRoutes = require('./createAuthRoutes');

module.exports = createAuthRoutes(authController);
