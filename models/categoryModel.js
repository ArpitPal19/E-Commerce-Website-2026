import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

// Remove any previously cached Category model
if (mongoose.models.Category) {
  delete mongoose.models.Category;
}

const categoryModel = mongoose.model("Category", categorySchema);

export default categoryModel;
