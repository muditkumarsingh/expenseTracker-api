const express = require('express')
const incomeController = require('../controllers/incomeController')

const { protect } = require('../middleware/authMiddleware')

const router = express.Router();


router.use(protect)


router.post('/add', incomeController.addIncome)
router.get('/get', incomeController.getAllIncome)
router.get('/downloadexcel', incomeController.downloadIncomeExcel)
router.delete('/:id', incomeController.deleteIncome)


module.exports = router
