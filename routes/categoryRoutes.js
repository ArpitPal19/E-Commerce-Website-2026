import express from "express";

import { isAdmin, requireSignIn } from "./../middlewares/authMiddleware.js";

import {
  categoryController,
  createCategoryController,
  deleteCategoryController,
  singleCategoryController,
  updateCategoryController,
} from "./../controllers/categoryController.js";

const router = express.Router();

// ================= CREATE CATEGORY =================
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  createCategoryController,
);

// ================= UPDATE CATEGORY =================
router.put(
  "/update-category",
  requireSignIn,
  isAdmin,
  updateCategoryController,
);

// ================= GET ALL CATEGORIES =================
router.get("/get-category", categoryController);

// ================= SINGLE CATEGORY =================
router.get("/single-category/:slug", singleCategoryController);

// ================= DELETE CATEGORY =================
router.put(
  "/delete-category/:id",
  requireSignIn,
  isAdmin,
  deleteCategoryController,
);

export default router;
