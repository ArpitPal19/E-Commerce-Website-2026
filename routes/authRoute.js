import express from "express";

import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  orderStatusController,
  getAllUsersController,
} from "../controllers/authController.js";

import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

// Router object
const router = express.Router();

// ================= ROUTES =================

// REGISTER || METHOD POST
router.post("/register", registerController);

// LOGIN || METHOD POST
router.post("/login", loginController);

// FORGOT PASSWORD || METHOD POST
router.post("/forgot-password", forgotPasswordController);

// TEST ROUTE || ADMIN
router.get("/test", requireSignIn, isAdmin, testController);

// PROTECTED USER ROUTE
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

// PROTECTED ADMIN ROUTE
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

// UPDATE PROFILE
router.put("/profile", requireSignIn, updateProfileController);

// ================= ORDERS =================

// USER ORDERS
router.get("/orders", requireSignIn, getOrdersController);

// ALL ORDERS || ADMIN
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// ORDER STATUS UPDATE || ADMIN
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController,
);

// ================= USERS =================

// GET ALL USERS || ADMIN
router.get("/users", requireSignIn, isAdmin, getAllUsersController);

export default router;
