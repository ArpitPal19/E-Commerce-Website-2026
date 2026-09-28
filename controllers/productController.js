import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import orderModel from "../models/orderModel.js";
import fs from "fs";
import slugify from "slugify";
import braintree from "braintree";
import dotenv from "dotenv";

dotenv.config();

// ================= PAYMENT GATEWAY =================

let gateway = null;

if (
  process.env.BRAINTREE_MERCHANT_ID &&
  process.env.BRAINTREE_PUBLIC_KEY &&
  process.env.BRAINTREE_PRIVATE_KEY
) {
  gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
  });
}

// ================= CREATE PRODUCT =================

export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields || {};

    const photo = req.files?.photo;

    // Validation
    switch (true) {
      case !name:
        return res.status(400).send({
          success: false,
          message: "Name is Required",
        });

      case !description:
        return res.status(400).send({
          success: false,
          message: "Description is Required",
        });

      case !price:
        return res.status(400).send({
          success: false,
          message: "Price is Required",
        });

      case !category:
        return res.status(400).send({
          success: false,
          message: "Category is Required",
        });

      case !quantity:
        return res.status(400).send({
          success: false,
          message: "Quantity is Required",
        });

      case !photo:
        return res.status(400).send({
          success: false,
          message: "Photo is Required",
        });

      case photo && photo.size > 1000000:
        return res.status(400).send({
          success: false,
          message: "Photo should be less than 1MB",
        });
    }

    // Create a NEW product
    const product = new productModel({
      name,
      description,
      price,
      category,
      quantity,
      shipping,
      slug: slugify(name),
    });

    // Save product photo
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();

    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      product,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error in creating product",
      error: error.message,
    });
  }
};

// ================= GET ALL PRODUCTS =================

export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      counTotal: products.length,
      message: "All Products",
      products,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error in getting product",
      error: error.message,
    });
  }
};

// ================= GET SINGLE PRODUCT =================

export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");

    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error while getting single product",
      error: error.message,
    });
  }
};

// ================= PRODUCT PHOTO =================

export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");

    if (!product || !product.photo || !product.photo.data) {
      return res.status(404).send({
        success: false,
        message: "Product photo not found",
      });
    }

    res.set("Content-type", product.photo.contentType);

    return res.status(200).send(product.photo.data);
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error in getting product photo",
      error: error.message,
    });
  }
};

// ================= DELETE PRODUCT =================

export const deleteProductController = async (req, res) => {
  try {
    const product = await productModel.findByIdAndDelete(req.params.pid);

    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error: error.message,
    });
  }
};

// ================= UPDATE PRODUCT =================

export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields || {};

    const photo = req.files?.photo;

    // Validation
    switch (true) {
      case !name:
        return res.status(400).send({
          success: false,
          message: "Name is Required",
        });

      case !description:
        return res.status(400).send({
          success: false,
          message: "Description is Required",
        });

      case !price:
        return res.status(400).send({
          success: false,
          message: "Price is Required",
        });

      case !category:
        return res.status(400).send({
          success: false,
          message: "Category is Required",
        });

      case !quantity:
        return res.status(400).send({
          success: false,
          message: "Quantity is Required",
        });

      case photo && photo.size > 1000000:
        return res.status(400).send({
          success: false,
          message: "Photo should be less than 1MB",
        });
    }

    // Find existing product
    const product = await productModel.findById(req.params.pid);

    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    // Update product fields
    product.name = name;
    product.description = description;
    product.price = price;
    product.category = category;
    product.quantity = quantity;
    product.shipping = shipping;
    product.slug = slugify(name);

    // Update photo only if a new photo is provided
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();

    res.status(200).send({
      success: true,
      message: "Product Updated Successfully",
      product,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error in Updating product",
      error: error.message,
    });
  }
};

// ================= FILTER PRODUCTS =================

export const productFiltersController = async (req, res) => {
  try {
    const { checked = [], radio = [] } = req.body;

    const args = {};

    if (checked.length > 0) {
      args.category = checked;
    }

    if (radio.length) {
      args.price = {
        $gte: radio[0],
        $lte: radio[1],
      };
    }

    const products = await productModel
      .find(args)
      .populate("category")
      .select("-photo");

    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);

    res.status(400).send({
      success: false,
      message: "Error while Filtering Products",
      error: error.message,
    });
  }
};

// ================= PRODUCT COUNT =================

export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();

    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);

    res.status(400).send({
      success: false,
      message: "Error in product count",
      error: error.message,
      success: false,
    });
  }
};

// ================= PRODUCT LIST BY PAGE =================

export const productListController = async (req, res) => {
  try {
    const perPage = 2;
    const page = req.params.page ? req.params.page : 1;

    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);

    res.status(400).send({
      success: false,
      message: "Error in per page ctrl",
      error: error.message,
    });
  }
};

// ================= SEARCH PRODUCT =================

export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;

    const results = await productModel
      .find({
        $or: [
          {
            name: {
              $regex: keyword,
              $options: "i",
            },
          },
          {
            description: {
              $regex: keyword,
              $options: "i",
            },
          },
        ],
      })
      .select("-photo");

    res.json(results);
  } catch (error) {
    console.log(error);

    res.status(400).send({
      success: false,
      message: "Error in Search Product API",
      error: error.message,
    });
  }
};

// ================= SIMILAR PRODUCTS =================

export const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;

    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");

    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);

    res.status(400).send({
      success: false,
      message: "Error while getting related product",
      error: error.message,
    });
  }
};

// ================= PRODUCTS BY CATEGORY =================

export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({
      slug: req.params.slug,
    });

    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }

    const products = await productModel
      .find({ category: category._id })
      .populate("category");

    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);

    res.status(400).send({
      success: false,
      error: error.message,
      message: "Error while Getting products",
    });
  }
};

// ================= BRAINTREE TOKEN =================

export const braintreeTokenController = async (req, res) => {
  try {
    if (!gateway) {
      return res.status(503).send({
        success: false,
        message:
          "Braintree payment gateway is not configured. Add Braintree credentials to the .env file.",
      });
    }

    gateway.clientToken.generate({}, (err, response) => {
      if (err) {
        return res.status(500).send(err);
      }

      res.send(response);
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error generating Braintree token",
      error: error.message,
    });
  }
};

// ================= PAYMENT =================

export const brainTreePaymentController = async (req, res) => {
  try {
    if (!gateway) {
      return res.status(503).send({
        success: false,
        message:
          "Braintree payment gateway is not configured. Add Braintree credentials to the .env file.",
      });
    }

    const { cart, nonce } = req.body;

    let total = 0;

    cart.map((i) => {
      total += i.price;
    });

    gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      async (error, result) => {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          });

          await order.save();

          return res.json({ ok: true });
        }

        return res.status(500).send(error);
      },
    );
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error while processing payment",
      error: error.message,
    });
  }
};
