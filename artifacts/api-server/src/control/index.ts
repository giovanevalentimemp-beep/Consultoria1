import { Router,type IRouter } from "express";
import companies from "./companies";
import records from "./records";
import documents from "./documents";
import email from "./email";
import views from "./views";
import { controlGuard } from "./core";

const router:IRouter=Router();
router.use(controlGuard);
router.use(companies,records,documents,email,views);
export default router;
