import express from "express";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  getAllProductReviews,
  deleteReview,
} from "../controllers/productController.js";
import { isAdmin, isAuthentication } from "../middlewares/auth.js";

const router = express.Router();

router.route("/products").get(getAllProducts);
router
  .route("/admin/product/new")
  .post(isAuthentication, isAdmin, createProduct);
router
  .route("/admin/product/:id")
  .put(isAuthentication, isAdmin, updateProduct)
  .delete(isAuthentication, isAdmin, deleteProduct);

router.route("/product/:id").get(getProductDetails);

router.route("/review").put(isAuthentication,createProductReview)

router.route("/reviews").get(getAllProductReviews).delete(isAuthentication,deleteReview)

export default router;
