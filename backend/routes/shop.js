import { Router } from "express";
import product from "../models/product.js";

const router = Router();

// GET /shop/getAll
router.get("/getAll", (req, res) => {
  product.find().then((result) => {
    res.status(200).json(result);
  }).catch((err) => {
    console.log(err);
  });
});
// GET /shop/getOne/:id
router.get("/getOne/:id", (req, res) => {
  product.findById(req.params.id).then((result) => {
    res.status(200).json(result);
  }).catch((err) => {
    console.log(err);
  });
});

export default router;