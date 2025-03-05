import { Router } from "express";
import product from "../models/product.js";

const router = Router();

// POST /admin/addProduct
router.post("/addProduct", (req, res) => {
  let newProduct = new product({
    name: req.body.name,
    productSize: req.body.productSize,
    image: req.body.image,
    category: req.body.category,
    description: req.body.description,
  });
  newProduct.save().then((result) => {
    res.status(201).json({
      message: "Product added successfully",
      product: result,
    });
  }).catch((err) => {
    console.log(err);
  });
});

export default router;