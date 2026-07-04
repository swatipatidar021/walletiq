const express = require("express");
const bcrypt = require("bcryptjs");
const usersModel = require("../models/users");
const router = express.Router()

// Creating a user
router.post("/create", async (req, res) => {
    try {
        const existingUser = await usersModel.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(409).json({
                created: false,
                message: "An account with this email already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newUser = new usersModel({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })

        const createdUser = await newUser.save();
        const safeUser = createdUser.toObject();
        delete safeUser.password;

        res.status(201).json({
            created: true,
            user: safeUser
        })
    } catch(err) {
        res.status(400).json({
            created: false,
            error: err
        })
    }
})

// Logging in a user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            })
        }

        const user = await usersModel.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        const passwordMatches = await bcrypt.compare(password, user.password);
        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        const safeUser = user.toObject();
        delete safeUser.password;

        res.status(200).json({
            success: true,
            data: safeUser
        })
    } catch(err) {
        res.status(500).json({
            success: false,
            message: "Server error, please try again",
            error: err
        })
    }
})

// Get a single user
router.get("/:id", async (req, res) => {
    try {
        const user = await usersModel.findById(req.params.id).select("-password");
        if (user === null) {
            return res.status(404).json({
                message: "Could not find user",
            })
        }
        res.status(200).json({
            message: "User found",
            data: user
        })
    } catch(err) {
        res.status(500).json({
            message: "Could not find user",
            errorType: "server",
            error: err
        })
    }
})

// Add income
router.post("/income/add", async (req, res) => {
    if (req.body.id === "" || req.body.id === null) {
        return res.status(404).json({
            error: "Authentication Error",
            message: "You are not an authenticated user, create an account"
        })
    }

    try {
        const options = {"$push": {"income": req.body.amount}}
        const updateUserIncome = await usersModel.findByIdAndUpdate(req.body.id, options)
        res.status(200).json({
            message: `Income added successfully: ₹${req.body.amount}`,
            income: updateUserIncome.income 
        })
    } catch(err) {
        res.status(404).json({
            message: "Could not add income",
            error: err
        })
    }
})

// Add expense
router.post("/expenses/add", async (req, res) => {
    if (req.body.id === "" || req.body.id === null) {
        return res.status(404).json({
            error: "Authentication Error",
            message: "You are not an authenticated user, create an account"
        })
    }
 
    try {
        const options = {"$push": {"expenses": {
            expenseType: req.body.expenseType,
            amount: req.body.amount
        }}}
        const updateUserExpense = await usersModel.findByIdAndUpdate(req.body.id, options)
        res.status(200).json({
            message: `expense added successfully: ₹${req.body.amount}`,
            expense: updateUserExpense.expenses
        })
    } catch(err) {
        res.status(404).json({
            message: "Could not add expense",
            error: err
        })
    }
})

// Delete income
router.post("/income/delete", async (req, res) => {
    if (req.body.id === "" || req.body.id === null || req.body.id === undefined) {
        return res.status(404).json({
            error: "Authentication Error",
            message: "You are not an authenticated user, create an account"
        })
    }

    try {
        const user = await usersModel.findById(req.body.id);
        if (!user) {
            return res.status(404).json({
                message: "Could not find user"
            })
        }

        const index = req.body.index;
        if (index < 0 || index >= user.income.length) {
            return res.status(400).json({
                message: "Invalid income entry"
            })
        }

        user.income.splice(index, 1);
        await user.save();

        res.status(200).json({
            message: "Income deleted successfully",
            income: user.income
        })
    } catch(err) {
        res.status(404).json({
            message: "Could not delete income",
            error: err
        })
    }
})

// Delete expense
router.post("/expenses/delete", async (req, res) => {
    if (req.body.id === "" || req.body.id === null || req.body.id === undefined) {
        return res.status(404).json({
            error: "Authentication Error",
            message: "You are not an authenticated user, create an account"
        })
    }

    try {
        const options = { "$pull": { "expenses": { "_id": req.body.expenseId } } }
        const updatedUser = await usersModel.findByIdAndUpdate(req.body.id, options, { new: true })
        if (!updatedUser) {
            return res.status(404).json({
                message: "Could not find user"
            })
        }

        res.status(200).json({
            message: "Expense deleted successfully",
            expenses: updatedUser.expenses
        })
    } catch(err) {
        res.status(404).json({
            message: "Could not delete expense",
            error: err
        })
    }
})

// Update budget
router.post("/budget/update", async (req, res) => {
    if (req.body === {} || req.body === null) {
        res.status(404).json({
            error: "Authentication Error",
            message: "You are not an authenticated user, create an account"
        })
        return
    }

    try {
        const options = {"budgetAmount": req.body.amount}
        const updateUserBudget = await usersModel.findByIdAndUpdate(req.body.id, options)
        res.status(201).json({
            message: `Budget added successfully: ₹${req.body.amount}`,
            update: updateUserBudget
        })

    } catch(err) {
        res.status(404).json({
            message: "Failed to update budget",
            error: err
        })
    }
})

router.post("/messages/update", async (req, res) => {
    try {
        const options = {
            "advice": req.body.advice,
            "motivation": req.body.motivation
        }
        const updateMessage = await usersModel.findByIdAndUpdate(req.body.id, options)
        res.status(201).json({
            message: "Messages updated successfully",
            update: updateMessage
        })
    } catch(err) {
        res.status(404).json({
            message: "Could not updated the inputs"
        })
    }
})

module.exports = router;

