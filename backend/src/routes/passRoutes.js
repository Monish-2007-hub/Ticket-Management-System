const express = require('express');
const router = express.Router();
const { getAllPasses, issuePass } = require('../controllers/passController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getAllPasses);
router.post('/', authMiddleware, issuePass);

module.exports = router;
