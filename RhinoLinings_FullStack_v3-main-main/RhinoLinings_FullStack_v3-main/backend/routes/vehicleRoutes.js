import express from "express";
import {
    getBrandsByType,
    getModelsByBrand,
    getVehicleTypes,
    getYearsByModel,
} from "../controllers/vehicleController.js";

const router = express.Router();

router.get("/types", getVehicleTypes);
router.get("/brands/:type", getBrandsByType);
router.get("/models/:brand", getModelsByBrand);
router.get("/years/:model", getYearsByModel);

export default router;