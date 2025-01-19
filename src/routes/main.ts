import { RequestHandler, Router } from "express";
import { loginUser, logoutUser, verifyCookies } from "../controllers/user";
import commonAuth from "../middlewares/auth";
 

const router: Router = Router();

router.post("/login", loginUser);
router.post("/logout", logoutUser);



router.use(commonAuth)
router.get("/verify", verifyCookies);

export default router;