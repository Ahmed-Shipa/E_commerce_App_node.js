import { Router } from "express";
import { checkEmail } from "../../middleware/checkEmail.js";
import { changeUserPassword, signIn, signUp } from "./auth.controller.js";

const authRouter = Router();

authRouter.post("/signup", checkEmail, signUp);
authRouter.post("/signin", signIn);
authRouter.patch("/changePassword", changeUserPassword);

export default authRouter;
