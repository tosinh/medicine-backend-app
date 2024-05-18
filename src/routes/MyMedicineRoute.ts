import express from "express";
import multer from "multer";
import MyMedicineController from "../controllers/MyMedicineController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyMedicineRequest } from "../middleware/validation";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5mb
  },
});

router.get(
  "/order",
  jwtCheck,
  jwtParse,
  MyMedicineController.getMyMedicineOrders
);

router.patch(
  "/order/:orderId/status",
  jwtCheck,
  jwtParse,
  MyMedicineController.updateOrderStatus
);

router.get("/", jwtCheck, jwtParse, MyMedicineController.getMyMedicine);

router.post(
  "/",
  upload.single("imageFile"),
  validateMyMedicineRequest,
  jwtCheck,
  jwtParse,
  MyMedicineController.createMyMedicine
);

router.put(
  "/",
  upload.single("imageFile"),
  validateMyMedicineRequest,
  jwtCheck,
  jwtParse,
  MyMedicineController.updateMyMedicine
);

export default router;
