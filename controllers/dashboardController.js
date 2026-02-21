const Income = require("../models/Income")
const Expense = require("../models/Expense")
const { isValidObjectId, Types } = require("mongoose")

const getDashboardData = async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new Types.ObjectId(String(userId))

        //fetch total income and expenses
        const totalIncome = await Income.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        console.log("totalIncome", { totalIncome, userId: isValidObjectId(userId) })
        
        const totalExpense = await Expense.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        
        console.log("totalExpense", { totalExpense, userId: isValidObjectId(userId) })
       

        const last60DaysIncomeTransactions = await Income.find({
            userId,
            date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) }
        }).sort({ date: -1 });

        const incomeLast60Days = last60DaysIncomeTransactions.reduce(
            (sum, transaction) => sum + transaction.amount,
            0
        )


        //get expense in last 30 days
        const last30DaysExpenseTransaction = await Expense.find({
            userId,
            date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }).sort({ date: -1 });

        //expenses last 30 days
        const expensesLast30Days = last30DaysExpenseTransaction.reduce(
            (sum, transaction) => sum + transaction.amount,
            0
        )

        //fetch last 5 transaction (income + expense)
        const incomeTxns = (await Income.find({ userId: userObjectId })
            .sort({ date: -1 })
            .limit(5)
        ).map(txn => ({
            ...txn.toObject(),
            type: "income"
        }));

        const expenseTxns = (await Expense.find({ userId: userObjectId })
            .sort({ date: -1 })
            .limit(5)
        ).map(txn => ({
            ...txn.toObject(),
            type: "expense"
        }));

        const lastTransactions = [...incomeTxns, ...expenseTxns]
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        res.json({
            totalBalance: (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
            totalIncome: totalIncome[0]?.total || 0,
            totalExpense: totalExpense[0]?.total || 0,
            last30DaysExpenses: {
                total: expensesLast30Days,
                transactions: last30DaysExpenseTransaction
            },
            last60DaysIncome: {
                total: incomeLast60Days,
                transactions: last60DaysIncomeTransactions
            },
            recentTansactions: lastTransactions

        })

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

module.exports = { getDashboardData }