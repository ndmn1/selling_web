import mongoose from "mongoose";

const { Schema } = mongoose;

const sizeSchema = new Schema({
  size: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  _id: false, // <-- disable `_id` for subdocument
});
const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  productSize: [sizeSchema],
  mainImage: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
  },
  brand: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
    default: 0,
  },
  price: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("Product", productSchema);
