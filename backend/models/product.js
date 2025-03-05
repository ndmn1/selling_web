import mongoose from "mongoose";

const { Schema } = mongoose;

const sizeSchema = new Schema({
  size: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
    default: 0,
  },
  _id: false, // <-- disable `_id` for subdocument
});
const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  productSize: [sizeSchema],
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Product", productSchema);
