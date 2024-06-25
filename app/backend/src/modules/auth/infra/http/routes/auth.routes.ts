import { Router } from "express"
import SignUpController from "../controllers/SignUpController"

const authRoutes = Router()
const signUpController = new SignUpController()

authRoutes.post("/signUp", 
	signUpController.handle
)

export default authRoutes