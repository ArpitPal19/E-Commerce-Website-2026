import React, { useEffect, useState } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);

  // Get all products
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/get-product");
      setProducts(data.products || []);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  // Lifecycle method
  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <Layout>
      <div className="row">
        {/* =========================
            ADMIN MENU
        ========================== */}
        <div className="col-md-3">
          <AdminMenu />
        </div>

        {/* =========================
            PRODUCTS
        ========================== */}
        <div className="col-md-9">
          <h1 className="text-center mb-4">All Products List</h1>

          <div className="row">
            {products?.map((p) => (
              <div
                className="col-xl-4 col-lg-6 col-md-6 col-sm-6 mb-4"
                key={p._id}
              >
                <Link
                  to={`/dashboard/admin/product/${p.slug}`}
                  className="text-decoration-none text-dark"
                >
                  <div
                    className="card h-100 shadow-sm"
                    style={{
                      borderRadius: "10px",
                      overflow: "hidden",
                    }}
                  >
                    {/* Product Image */}
                    <div
                      style={{
                        height: "220px",
                        backgroundColor: "#f8f8f8",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={`${import.meta.env.VITE_API}/api/v1/product/product-photo/${p._id}`}
                        className="card-img-top"
                        alt={p.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          padding: "10px",
                        }}
                      />
                    </div>

                    {/* Product Details */}
                    <div className="card-body">
                      <h5 className="card-title fw-bold">{p.name}</h5>

                      <p
                        className="card-text text-muted"
                        style={{
                          fontSize: "14px",
                        }}
                      >
                        {p.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
