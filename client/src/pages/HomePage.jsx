import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";

const HomePage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // =========================
  // GET TOTAL PRODUCTS
  // =========================
  const getTotal = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/product-count");
      setTotal(data?.total || 0);
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // GET ALL CATEGORIES
  // =========================
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");

      if (data?.success) {
        setCategories(data?.category || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);

  // =========================
  // GET FIRST PRODUCTS
  // =========================
  const getAllProducts = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);

      setProducts(data?.products || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD MORE PRODUCTS
  // =========================
  const loadMore = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);

      setProducts((prevProducts) => [
        ...prevProducts,
        ...(data?.products || []),
      ]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (page === 1) {
      getAllProducts();
    } else {
      loadMore();
    }
  }, [page]);

  // =========================
  // CATEGORY FILTER
  // =========================
  const handleFilter = (value, id) => {
    let all = [...checked];

    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }

    setChecked(all);
    setPage(1);
  };

  // =========================
  // FILTER PRODUCTS
  // =========================
  const filterProduct = async () => {
    try {
      setLoading(true);

      const { data } = await axios.post("/api/v1/product/product-filters", {
        checked,
        radio,
      });

      setProducts(data?.products || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (checked.length === 0 && radio.length === 0) {
      getAllProducts();
    } else {
      filterProduct();
    }
  }, [checked, radio]);

  // =========================
  // ADD TO CART
  // =========================
  const addToCart = (product) => {
    const updatedCart = [...cart, product];

    setCart(updatedCart);

    localStorage.setItem("cart", JSON.stringify(updatedCart));

    toast.success("Item Added to Cart");
  };

  // =========================
  // RESET FILTERS
  // =========================
  const resetFilters = () => {
    setChecked([]);
    setRadio([]);
    setPage(1);
  };

  return (
    <Layout title={"All Products - Best Offers"}>
      {/* =========================
          HOME PAGE BACKGROUND
      ========================== */}
      <div
        style={{
          backgroundColor: "#f8f9fa",
          minHeight: "100vh",
          paddingTop: "10px",
          paddingBottom: "40px",
        }}
      >
        <div className="container-fluid px-4">
          {/* =========================
              PAGE HEADER
          ========================== */}
          <div className="text-center py-4">
            <h1
              className="fw-bold mb-2"
              style={{
                fontSize: "34px",
                letterSpacing: "1px",
              }}
            >
              Our Products
            </h1>

            <p className="text-muted mb-0">
              Explore our collection of quality products
            </p>
          </div>

          <div className="row">
            {/* =========================
                FILTER SIDEBAR
            ========================== */}
            <div className="col-lg-2 col-md-3 mb-4">
              <div
                className="card border-0 shadow-sm"
                style={{
                  borderRadius: "12px",
                  position: "sticky",
                  top: "20px",
                }}
              >
                <div className="card-body">
                  <h5 className="fw-bold mb-3">Categories</h5>

                  <div className="d-flex flex-column gap-2">
                    {categories?.map((c) => (
                      <Checkbox
                        key={c._id}
                        checked={checked.includes(c._id)}
                        onChange={(e) => handleFilter(e.target.checked, c._id)}
                      >
                        <span style={{ fontSize: "14px" }}>{c.name}</span>
                      </Checkbox>
                    ))}
                  </div>

                  <hr />

                  {/* PRICE FILTER */}
                  <h5 className="fw-bold mb-3">Price</h5>

                  <Radio.Group
                    onChange={(e) => {
                      setRadio(e.target.value);
                      setPage(1);
                    }}
                    value={radio}
                  >
                    <div className="d-flex flex-column gap-2">
                      {Prices?.map((p) => (
                        <Radio value={p.array} key={p._id}>
                          <span style={{ fontSize: "14px" }}>{p.name}</span>
                        </Radio>
                      ))}
                    </div>
                  </Radio.Group>

                  <button
                    className="btn btn-outline-danger w-100 mt-4"
                    onClick={resetFilters}
                    style={{
                      borderRadius: "6px",
                      fontWeight: "600",
                      fontSize: "13px",
                    }}
                  >
                    RESET FILTERS
                  </button>
                </div>
              </div>
            </div>

            {/* =========================
                PRODUCTS
            ========================== */}
            <div className="col-lg-10 col-md-9">
              {/* CATEGORY QUICK BUTTONS */}
              <div className="d-flex flex-wrap gap-2 mb-4">
                <button className="btn btn-dark" onClick={resetFilters}>
                  All Products
                </button>

                {categories?.map((c) => (
                  <button
                    key={c._id}
                    className="btn btn-outline-dark"
                    onClick={() => {
                      setChecked([c._id]);
                      setRadio([]);
                      setPage(1);
                    }}
                    style={{
                      borderRadius: "20px",
                      padding: "6px 16px",
                    }}
                  >
                    {c.name}
                  </button>
                ))}
              </div>

              {/* PRODUCT COUNT */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-bold mb-0">All Products</h4>

                <span className="text-muted">
                  {products.length} of {total} products
                </span>
              </div>

              {/* LOADING */}
              {loading && products.length === 0 ? (
                <div className="text-center py-5">
                  <div className="spinner-border" role="status"></div>

                  <p className="mt-3 text-muted">Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-5">
                  <h4>No Products Found</h4>

                  <button className="btn btn-dark mt-3" onClick={resetFilters}>
                    View All Products
                  </button>
                </div>
              ) : (
                <div className="row">
                  {products?.map((p) => (
                    <div
                      className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-4"
                      key={p._id}
                    >
                      <div
                        className="card h-100 border-0 shadow-sm"
                        style={{
                          borderRadius: "12px",
                          overflow: "hidden",
                          transition: "0.3s",
                        }}
                      >
                        {/* PRODUCT IMAGE */}
                        <div
                          style={{
                            height: "250px",
                            backgroundColor: "#f8f8f8",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                          }}
                        >
                          <img
                            src={`/api/v1/product/product-photo/${p._id}`}
                            alt={p.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                              padding: "12px",
                            }}
                          />
                        </div>

                        {/* PRODUCT INFO */}
                        <div className="card-body d-flex flex-column">
                          <h5
                            className="card-title fw-bold"
                            style={{
                              fontSize: "17px",
                              minHeight: "42px",
                            }}
                          >
                            {p.name}
                          </h5>

                          <p
                            className="text-muted mb-2"
                            style={{
                              fontSize: "13px",
                              minHeight: "40px",
                            }}
                          >
                            {p.description
                              ? `${p.description.substring(0, 45)}...`
                              : "No description available"}
                          </p>

                          <h5 className="fw-bold mb-3">${p.price}</h5>

                          {/* BUTTONS */}
                          <div className="d-flex gap-2 mt-auto">
                            <button
                              className="btn btn-outline-dark flex-fill"
                              style={{
                                fontSize: "12px",
                                fontWeight: "600",
                              }}
                              onClick={() => navigate(`/product/${p.slug}`)}
                            >
                              MORE DETAILS
                            </button>

                            <button
                              className="btn btn-dark flex-fill"
                              style={{
                                fontSize: "12px",
                                fontWeight: "600",
                              }}
                              onClick={() => addToCart(p)}
                            >
                              ADD TO CART
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* =========================
                  LOAD MORE
              ========================== */}
              {checked.length === 0 &&
                radio.length === 0 &&
                products.length > 0 &&
                products.length < total && (
                  <div className="text-center my-5">
                    <button
                      className="btn btn-dark px-5 py-2"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage((prevPage) => prevPage + 1);
                      }}
                      disabled={loading}
                      style={{
                        borderRadius: "6px",
                        fontWeight: "600",
                      }}
                    >
                      {loading ? "LOADING..." : "LOAD MORE"}
                    </button>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
