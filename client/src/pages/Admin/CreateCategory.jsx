import React, { useEffect, useState } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import CategoryForm from "../../components/Form/CategoryForm";
import { Modal } from "antd";

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [creatingCategories, setCreatingCategories] = useState(false);

  // =========================================================
  // REQUIRED CATEGORIES FOR OUR PRODUCTS
  // =========================================================

  const requiredCategories = [
    "Alarm Clock",
    "Smart Watch",
    "Women",
    "Men",
    "Stopwatch",
    "Wall Clock",
  ];

  // =========================================================
  // CREATE CATEGORY
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter category name");
      return;
    }

    try {
      const { data } = await axios.post("/api/v1/category/create-category", {
        name: name.trim(),
      });

      if (data?.success) {
        toast.success(`${name} is created`);
        setName("");
        getAllCategory();
      } else {
        toast.error(data?.message || "Something went wrong");
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error?.response?.data?.message || "Something went wrong in input form",
      );
    }
  };

  // =========================================================
  // GET ALL CATEGORIES
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
  // CREATE ALL REQUIRED CATEGORIES
  // =========================================================

  const handleCreateRequiredCategories = async () => {
    try {
      setCreatingCategories(true);

      let createdCount = 0;
      let existingCount = 0;

      for (const categoryName of requiredCategories) {
        // Check whether category already exists
        const alreadyExists = categories.some(
          (category) =>
            category?.name?.toLowerCase().trim() ===
            categoryName.toLowerCase().trim(),
        );

        if (alreadyExists) {
          existingCount++;
          continue;
        }

        try {
          const { data } = await axios.post(
            "/api/v1/category/create-category",
            {
              name: categoryName,
            },
          );

          if (data?.success) {
            createdCount++;
          } else {
            // Category may already exist in the database
            console.log(`Could not create ${categoryName}:`, data);
          }
        } catch (error) {
          console.log(`Error creating ${categoryName}:`, error);
        }
      }

      // Refresh category list
      await getAllCategory();

      if (createdCount > 0) {
        toast.success(
          `${createdCount} required categor${
            createdCount === 1 ? "y" : "ies"
          } created successfully`,
        );
      }

      if (createdCount === 0 && existingCount === requiredCategories.length) {
        toast.success("All required categories already exist");
      }
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong while creating categories");
    } finally {
      setCreatingCategories(false);
    }
  };

  // =========================================================
  // UPDATE CATEGORY
  // =========================================================

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!selected?._id) {
      toast.error("Please select a category");
      return;
    }

    if (!updatedName.trim()) {
      toast.error("Please enter category name");
      return;
    }

    try {
      const { data } = await axios.put(
        `/api/v1/category/update-category/${selected._id}`,
        {
          name: updatedName.trim(),
        },
      );

      if (data?.success) {
        toast.success(`${updatedName} is updated`);

        setSelected(null);
        setUpdatedName("");
        setVisible(false);

        getAllCategory();
      } else {
        toast.error(data?.message || "Something went wrong");
      }
    } catch (error) {
      console.log(error);

      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  // =========================================================
  // DELETE CATEGORY
  // =========================================================

  const handleDelete = async (pId) => {
    try {
      const { data } = await axios.put(
        `/api/v1/category/delete-category/${pId}`,
      );

      if (data?.success) {
        toast.success("Category is deleted");
        getAllCategory();
      } else {
        toast.error(data?.message || "Something went wrong");
      }
    } catch (error) {
      console.log(error);

      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Layout title={"Dashboard - Create Category"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          {/* =================================================
              ADMIN MENU
          ================================================= */}

          <div className="col-md-3">
            <AdminMenu />
          </div>

          {/* =================================================
              MAIN CONTENT
          ================================================= */}

          <div className="col-md-9">
            <h1>Manage Category</h1>

            {/* =================================================
                QUICK CREATE REQUIRED CATEGORIES
            ================================================= */}

            <div
              className="card mb-4"
              style={{
                width: "75%",
                backgroundColor: "#f8f9fa",
              }}
            >
              <div className="card-body">
                <h4>Product Categories</h4>

                <p className="text-muted mb-3">
                  Create the categories required for the 18 watch and clock
                  products.
                </p>

                <div className="mb-3">
                  {requiredCategories.map((categoryName) => (
                    <span
                      key={categoryName}
                      className="badge bg-secondary me-2 mb-2"
                    >
                      {categoryName}
                    </span>
                  ))}
                </div>

                <button
                  className="btn btn-success"
                  onClick={handleCreateRequiredCategories}
                  disabled={creatingCategories}
                >
                  {creatingCategories
                    ? "CREATING CATEGORIES..."
                    : "CREATE REQUIRED CATEGORIES"}
                </button>
              </div>
            </div>

            {/* =================================================
                MANUAL CREATE CATEGORY
            ================================================= */}

            <div className="p-3 w-50">
              <h5>Create Category Manually</h5>

              <CategoryForm
                handleSubmit={handleSubmit}
                value={name}
                setValue={setName}
              />
            </div>

            {/* =================================================
                CATEGORY TABLE
            ================================================= */}

            <div className="w-75">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>

                    <th scope="col">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {categories?.map((c) => (
                    <tr key={c._id}>
                      <td>{c.name}</td>

                      <td>
                        {/* EDIT */}

                        <button
                          className="btn btn-primary ms-2"
                          onClick={() => {
                            setVisible(true);
                            setUpdatedName(c.name);
                            setSelected(c);
                          }}
                        >
                          Edit
                        </button>

                        {/* DELETE */}

                        <button
                          className="btn btn-danger ms-2"
                          onClick={() => handleDelete(c._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* =================================================
                UPDATE MODAL
            ================================================= */}

            <Modal
              onCancel={() => {
                setVisible(false);
                setSelected(null);
                setUpdatedName("");
              }}
              footer={null}
              open={visible}
            >
              <CategoryForm
                value={updatedName}
                setValue={setUpdatedName}
                handleSubmit={handleUpdate}
              />
            </Modal>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;
