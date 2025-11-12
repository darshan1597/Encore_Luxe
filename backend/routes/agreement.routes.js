import express from "express";
import { createAgreement } from "../controllers/agreement.controller.js";
import { uploadAgreementFiles } from "../middlewares/multer.js";

const agreementRouter = express.Router();

agreementRouter.post("/create-agreement", uploadAgreementFiles.array("agreementFiles", 3), createAgreement);

export default agreementRouter;
