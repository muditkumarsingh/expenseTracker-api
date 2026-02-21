const express = require('express')
const expenseController = require('../controllers/expenseController')

const { protect } = require('../middleware/authMiddleware')

const router = express.Router();


router.use(protect)


router.post('/add', expenseController.addExpense)
router.get('/get', expenseController.getAllExpense)
router.get('/downloadexcel', expenseController.downloadExpenseExcel)
router.delete('/:id', expenseController.deleteExpense)


module.exports = router
