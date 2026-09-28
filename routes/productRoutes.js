import express from "express";
import formidable from "express-formidable";

import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

import {
  brainTreePaymentController,
  braintreeTokenController,
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productCategoryController,
  productCountController,
  productFiltersController,
  productListController,
  productPhotoController,
  relatedProductController,
  searchProductController,
  updateProductController,
} from "../controllers/productController.js";

const router = express.Router();

// Create Product
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

// Update Product
router.post(
  "/update-product",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

// Get Products
router.get("/get-product", getProductController);

// Get Single Product
router.get("/get-product/:slug", getSingleProductController);

// Get Product Photo
router.get("/product-photo/:pid", productPhotoController);

// Delete Product
router.delete("/delete-product/:pid", deleteProductController);

// Filter Products
router.post("/product-filters", productFiltersController);

// Product Count
router.get("/product-count", productCountController);

// Product List Per Page
router.get("/product-list/:page", productListController);

// Search Product
router.get("/search/:keyword", searchProductController);

// Similar Products
router.get(
  "/related-product/:pid/:cid",
  relatedProductController
);

// Products By Category
router.get(
  "/product-category/:slug",
  productCategoryController
);

// Payment Routes

// Braintree Token
router.get("/braintree/token", braintreeTokenController);

// Braintree Payment
router.post(
  "/braintree/payment",
  requireSignIn,
  brainTreePaymentController
);

export default router;