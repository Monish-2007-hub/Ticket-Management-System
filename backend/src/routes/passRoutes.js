const express = require('express');
const router = express.Router();
const { getAllPasses, issuePass } = require('../controllers/passController');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getAllPasses);
router.post('/', authMiddleware, adminOnly, issuePass);

module.exports = router;
