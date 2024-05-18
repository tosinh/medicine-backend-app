import express from "express";
import { param } from "express-validator";
import MedicineController from "../controllers/MedicineController";

const router = express.Router();

router.get(
    "/:medicineId",
    param("medicineId")
        .isString()
        .trim()
        .notEmpty()
        .withMessage("MedicineId parameter must be a valid string"),
    MedicineController.getMedicine
);

router.get(
    "/search/:city",
    param("city")
        .isString()
        .trim()
        .notEmpty()
        .withMessage("City parameter must be a valid string"),
    MedicineController.searchMedicine
);

export default router;
