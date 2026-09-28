import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";

const CreateProduct = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState("");
  const [importing, setImporting] = useState(false);

  // =========================================================
  // PUBLIC IMAGES
  // =========================================================

  const publicImages = [
    { file: "a1.png", type: "alarm" },
    { file: "a2.png", type: "alarm" },
    { file: "a3.png", type: "alarm" },

    { file: "e1.png", type: "smart" },
    { file: "e2.png", type: "smart" },
    { file: "e3.png", type: "smart" },

    { file: "l1.png", type: "women" },
    { file: "l2.png", type: "women" },
    { file: "l3.png", type: "women" },

    { file: "m1.png", type: "men" },
    { file: "m2.png", type: "men" },
    { file: "m3.png", type: "men" },

    { file: "s1.png", type: "stopwatch" },
    { file: "s2.png", type: "stopwatch" },
    { file: "s3.png", type: "stopwatch" },

    { file: "w1.png", type: "wall" },
    { file: "w2.png", type: "wall" },
    { file: "w3.png", type: "wall" },
  ];

  // =========================================================
  // PRODUCT INFORMATION
  // =========================================================

  const productData = [
    {
      name: "Classic Alarm Clock",
      description: "Classic alarm clock with a stylish design",
      price: 25,
      quantity: 20,
      type: "alarm",
    },
    {
      name: "Modern Alarm Clock",
      description: "Modern alarm clock for home and office",
      price: 30,
      quantity: 20,
      type: "alarm",
    },
    {
      name: "Premium Alarm Clock",
      description: "Premium alarm clock with elegant design",
      price: 35,
      quantity: 20,
      type: "alarm",
    },

    {
      name: "Smart Watch Pro",
      description: "Smart watch with modern features and stylish design",
      price: 120,
      quantity: 20,
      type: "smart",
    },
    {
      name: "Smart Watch Classic",
      description: "Classic smart watch for everyday use",
      price: 150,
      quantity: 20,
      type: "smart",
    },
    {
      name: "Smart Watch Premium",
      description: "Premium smart watch with elegant design",
      price: 200,
      quantity: 20,
      type: "smart",
    },

    {
      name: "Trendy Ladies Watch",
      description: "Best trendy watch for women",
      price: 300,
      quantity: 20,
      type: "women",
    },
    {
      name: "Elegant Ladies Watch",
      description: "Elegant watch for women",
      price: 250,
      quantity: 20,
      type: "women",
    },
    {
      name: "Premium Ladies Watch",
      description: "Premium stylish watch for women",
      price: 400,
      quantity: 20,
      type: "women",
    },

    {
      name: "Metal Men's Watch",
      description: "Solid stainless steel men's watch",
      price: 25,
      quantity: 20,
      type: "men",
    },
    {
      name: "Classic Men's Watch",
      description: "Classic men's watch for everyday use",
      price: 50,
      quantity: 20,
      type: "men",
    },
    {
      name: "Premium Men's Watch",
      description: "Premium stylish stainless steel men's watch",
      price: 100,
      quantity: 20,
      type: "men",
    },

    {
      name: "Digital Stopwatch",
      description: "Digital stopwatch for sports and daily activities",
      price: 20,
      quantity: 20,
      type: "stopwatch",
    },
    {
      name: "Professional Stopwatch",
      description: "Professional stopwatch with accurate timing",
      price: 35,
      quantity: 20,
      type: "stopwatch",
    },
    {
      name: "Sports Stopwatch",
      description: "Sports stopwatch for accurate time tracking",
      price: 45,
      quantity: 20,
      type: "stopwatch",
    },

    {
      name: "Premium Wall Clock",
      description: "Best premium wall clock for home",
      price: 120,
      quantity: 20,
      type: "wall",
    },
    {
      name: "Wooden Wall Clock",
      description: "Best premium wooden wall clock for home",
      price: 150,
      quantity: 20,
      type: "wall",
    },
    {
      name: "Modern Wall Clock",
      description: "Modern stylish wall clock for home and office",
      price: 100,
      quantity: 20,
      type: "wall",
    },
  ];

  // =========================================================
  // GET CATEGORIES
  // =========================================================

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");

      if (data?.success) {
        setCategories(data?.category || []);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting category");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  // =========================================================
  // NORMAL FILE UPLOAD
  // =========================================================

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    setPhoto(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  // =========================================================
  // SELECT PUBLIC IMAGE
  // =========================================================

  const handlePublicImage = async (fileName) => {
    try {
      const response = await fetch(`/${fileName}`);

      if (!response.ok) {
        throw new Error("Image not found");
      }

      const blob = await response.blob();

      const file = new File([blob], fileName, {
        type: blob.type || "image/png",
      });

      setPhoto(file);
      setPreview(`/${fileName}`);

      toast.success(`${fileName} selected`);
    } catch (error) {
      console.log(error);
      toast.error(`Unable to load ${fileName}`);
    }
  };

  // =========================================================
  // FIND CATEGORY
  // =========================================================

  const findCategory = (type) => {
    const categoryNames = {
      alarm: "Alarm Clock",
      smart: "Smart Watch",
      women: "Women",
      men: "Men",
      stopwatch: "Stopwatch",
      wall: "Wall Clock",
    };

    const requiredName = categoryNames[type];

    if (!requiredName) {
      return null;
    }

    return categories.find(
      (category) =>
        category?.name?.trim().toLowerCase() ===
        requiredName.trim().toLowerCase(),
    );
  };

  // =========================================================
  // IMPORT ALL 18 PRODUCTS
  // =========================================================

  const handleImportProducts = async () => {
    if (categories.length === 0) {
      toast.error("No categories found. Please create your categories first.");
      return;
    }

    const confirmed = window.confirm(
      "This will create 18 products in your database. Continue?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setImporting(true);

      let successCount = 0;
      let failedCount = 0;

      for (let i = 0; i < publicImages.length; i++) {
        const imageInfo = publicImages[i];
        const product = productData[i];

        try {
          // Find category
          const selectedCategory = findCategory(product.type);

          if (!selectedCategory) {
            console.log(`Category not found for ${product.name}`);

            failedCount++;
            continue;
          }

          // Load image from public folder
          const response = await fetch(`/${imageInfo.file}`);

          if (!response.ok) {
            throw new Error(`${imageInfo.file} not found`);
          }

          const blob = await response.blob();

          // Convert image into File
          const imageFile = new File([blob], imageInfo.file, {
            type: blob.type || "image/png",
          });

          // Create FormData
          const formData = new FormData();

          formData.append("name", product.name);

          formData.append("description", product.description);

          formData.append("price", product.price);

          formData.append("quantity", product.quantity);

          formData.append("category", selectedCategory._id);

          formData.append("shipping", "1");

          formData.append("photo", imageFile);

          // Send to existing backend
          const { data } = await axios.post(
            "/api/v1/product/create-product",
            formData,
          );

          if (data?.success) {
            successCount++;

            console.log(`Created ${successCount}/18: ${product.name}`);
          } else {
            failedCount++;

            console.log(`Failed: ${product.name}`, data);
          }
        } catch (error) {
          failedCount++;

          console.log(`Error creating ${product.name}`, error);
        }
      }

      if (successCount === 18) {
        toast.success("All 18 products created successfully!");
      } else if (successCount > 0) {
        toast.success(
          `${successCount} products created. ${failedCount} failed.`,
        );
      } else {
        toast.error("No products were created. Check your categories.");
      }

      // Refresh product list
      await getAllCategory();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while importing products");
    } finally {
      setImporting(false);
    }
  };

  // =========================================================
  // MANUAL CREATE PRODUCT
  // =========================================================

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter product name");
      return;
    }

    if (!description.trim()) {
      toast.error("Please enter product description");
      return;
    }

    if (!price) {
      toast.error("Please enter product price");
      return;
    }

    if (!quantity) {
      toast.error("Please enter product quantity");
      return;
    }

    if (!category) {
      toast.error("Please select a category");
      return;
    }

    if (!photo) {
      toast.error("Please select a product photo");
      return;
    }

    try {
      const productDataForm = new FormData();

      productDataForm.append("name", name);

      productDataForm.append("description", description);

      productDataForm.append("price", price);

      productDataForm.append("quantity", quantity);

      productDataForm.append("photo", photo);

      productDataForm.append("category", category);

      productDataForm.append("shipping", shipping);

      const { data } = await axios.post(
        "/api/v1/product/create-product",
        productDataForm,
      );

      if (data?.success) {
        toast.success("Product Created Successfully");

        setName("");
        setDescription("");
        setPrice("");
        setQuantity("");
        setCategory("");
        setShipping("");
        setPhoto(null);
        setPreview("");

        navigate("/dashboard/admin/products");
      } else {
        toast.error(data?.message || "Something went wrong");
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error?.response?.data?.message ||
          "Something went wrong while creating product",
      );
    }
  };

  return (
    <Layout title={"Dashboard - Create Product"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          {/* ================= ADMIN MENU ================= */}

          <div className="col-md-3">
            <AdminMenu />
          </div>

          {/* ================= MAIN CONTENT ================= */}

          <div className="col-md-9">
            <h1>Create Product</h1>

            {/* =================================================
                IMPORT ALL PRODUCTS
            ================================================= */}

            <div
              className="card mb-4"
              style={{
                background: "#f8f9fa",
                border: "1px solid #ddd",
              }}
            >
              <div className="card-body">
                <h4>Add Demo Products</h4>

                <p className="text-muted">
                  Import all 18 watch and clock products using the images from
                  your public folder.
                </p>

                <button
                  className="btn btn-success"
                  onClick={handleImportProducts}
                  disabled={importing}
                >
                  {importing
                    ? "IMPORTING PRODUCTS..."
                    : "IMPORT ALL 18 PRODUCTS"}
                </button>
              </div>
            </div>

            {/* =================================================
                MANUAL PRODUCT CREATION
            ================================================= */}

            <div className="m-1 w-75">
              {/* ================= CATEGORY ================= */}

              <div className="mb-3">
                <Select
                  value={category || undefined}
                  placeholder="Select a category"
                  size="large"
                  showSearch
                  style={{
                    width: "100%",
                  }}
                  optionFilterProp="children"
                  onChange={(value) => {
                    setCategory(value);
                  }}
                  filterOption={(input, option) =>
                    option?.children
                      ?.toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {categories.map((c) => (
                    <Select.Option key={c._id} value={c._id}>
                      {c.name}
                    </Select.Option>
                  ))}
                </Select>
              </div>

              {/* ================= PUBLIC IMAGES ================= */}

              <div className="mb-4">
                <h5>Select Product Image</h5>

                <div className="row">
                  {publicImages.map((image) => (
                    <div className="col-4 col-md-3 mb-3" key={image.file}>
                      <div
                        onClick={() => handlePublicImage(image.file)}
                        style={{
                          border:
                            preview === `/${image.file}`
                              ? "3px solid #0d6efd"
                              : "1px solid #ddd",
                          borderRadius: "8px",
                          padding: "5px",
                          cursor: "pointer",
                          textAlign: "center",
                        }}
                      >
                        <img
                          src={`/${image.file}`}
                          alt={image.file}
                          style={{
                            width: "100%",
                            height: "100px",
                            objectFit: "contain",
                          }}
                        />

                        <small>{image.file}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ================= OWN IMAGE ================= */}

              <div className="mb-3">
                <label className="btn btn-outline-secondary col-md-12">
                  {photo ? photo.name : "Upload Your Own Photo"}

                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={handleFileChange}
                    hidden
                  />
                </label>
              </div>

              {/* ================= PREVIEW ================= */}

              {preview && (
                <div className="mb-3 text-center">
                  <p>
                    <strong>Selected Image</strong>
                  </p>

                  <img
                    src={preview}
                    alt="product_preview"
                    height="200"
                    style={{
                      maxWidth: "300px",
                      objectFit: "contain",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      padding: "5px",
                    }}
                  />
                </div>
              )}

              {/* ================= NAME ================= */}

              <div className="mb-3">
                <input
                  type="text"
                  value={name}
                  placeholder="Write a name"
                  className="form-control"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* ================= DESCRIPTION ================= */}

              <div className="mb-3">
                <input
                  type="text"
                  value={description}
                  placeholder="Write a description"
                  className="form-control"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* ================= PRICE ================= */}

              <div className="mb-3">
                <input
                  type="number"
                  value={price}
                  placeholder="Write a price"
                  className="form-control"
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              {/* ================= QUANTITY ================= */}

              <div className="mb-3">
                <input
                  type="number"
                  value={quantity}
                  placeholder="Write a quantity"
                  className="form-control"
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              {/* ================= SHIPPING ================= */}

              <div className="mb-3">
                <Select
                  value={shipping || undefined}
                  placeholder="Select Shipping"
                  size="large"
                  style={{
                    width: "100%",
                  }}
                  onChange={(value) => setShipping(value)}
                >
                  <Select.Option value="0">No</Select.Option>

                  <Select.Option value="1">Yes</Select.Option>
                </Select>
              </div>

              {/* ================= CREATE ================= */}

              <div className="mb-3">
                <button
                  className="btn btn-primary"
                  onClick={handleCreate}
                  disabled={importing}
                >
                  CREATE PRODUCT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProduct;
