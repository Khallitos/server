import express from 'express'
const router = express.Router()
import {registerUser,loginUser,verifyUser,forgotPassword,changePassword,checkUserToken,loginAdmin} from '../controllers/authController.js'

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/verify').get(verifyUser)
router.route('/forgotpassword').post(forgotPassword)
router.route('/changepassword').post(changePassword)
router.route('/checkusertoken').post(checkUserToken)
router.route('/adminLogin').post(loginAdmin)




export default router