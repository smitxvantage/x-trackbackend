import { Router } from "express";
import * as controller from "./salary.controller.js";
import { calculateSalaryController } from "./salaryCalculationController.js";

const router = Router();

router.post("/create", controller.createEmployeeController);
router.get("/getemployee", controller.getEmployeesController);
router.get("/salary/calculate", calculateSalaryController);
export default router;
