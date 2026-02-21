const express = require("express")
const authControllers = require('../controllers/authController')
const { protect } = require('../middleware/authMiddleware')
const upload = require("../middleware/uplloadMiddleware")

const router = express.Router()

router.post('/register', authControllers.registerUser)

router.post('/login', authControllers.loginUser)

router.get('/getUser', protect, authControllers.getUserInfo)


router.post('/upload-image',upload.single('image'),(req,res)=>{
    if(!req.file){
        return res.status(400).json({message:"No file upload"})
    }
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
    }`
    res.status(200).json({imageUrl})
})

module.exports = router