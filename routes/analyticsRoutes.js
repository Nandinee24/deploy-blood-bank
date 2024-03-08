const express = require('express')

const authMiddleware = require('../middlewares/authMiddleware')
const { bloodGroupDetailsController } = require('../controllers/analyticsController')

const router = express.Router()

///routs 
//ADD INVENTORY || POST
router.post('/bloodGroups-data', authMiddleware, bloodGroupDetailsController)


module.exports = router;