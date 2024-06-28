import { Router } from "express";

import { SignUpController } from "../controllers/SignUpController";
import { SignInController } from "../controllers/SignInController";

const authRoutes = Router();
const signUpController = new SignUpController();
const signInController= new SignInController()

authRoutes.post("/signUp", signUpController.handle);
authRoutes.post("/signIn", signInController.handle)

export default authRoutes;
