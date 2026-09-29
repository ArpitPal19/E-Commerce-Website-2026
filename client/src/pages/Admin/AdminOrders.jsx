import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import moment from "moment";
import { Select } from "antd";

const { Option } = Select;

const AdminOrders = () => {
  const [status] = useState([
    "Not Process",
    "Processing",
    "Shipped",
    "delivered",
    "cancel",
  ]);

  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();

  // ================= GET ALL ORDERS =================
  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/all-orders");

      setOrders(data);
    } catch (error) {
      console.log("Get orders error:", error);

      toast.error("Something went wrong while getting orders");
    }
  };

  // ================= LOAD ORDERS =================
  useEffect(() => {
    if (auth?.token) {
      getOrders();
    }
  }, [auth?.token]);

  // ================= UPDATE ORDER STATUS =================
  const handleChange = async (orderId, value) => {
    try {
      await axios.put(`/api/v1/auth/order-status/${orderId}`, {
        status: value,
      });

      toast.success("Order status updated");

      // Refresh orders after updating status
      getOrders();
    } catch (error) {
      console.log("Update order status error:", error);

      toast.error("Something went wrong while updating status");
    }
  };

  return (
    <Layout title={"All Orders Data"}>
      <div className="row">
        {/* ================= ADMIN MENU ================= */}
        <div className="col-md-3">
          <AdminMenu />
        </div>

        {/* ================= ORDERS ================= */}
        <div className="col-md-9">
          <h1 className="text-center">All Orders</h1>

          {orders?.length === 0 ? (
            <h4 className="text-center mt-4">No Orders Found</h4>
          ) : (
            orders?.map((o, i) => {
              return (
                <div className="border shadow mb-4" key={o?._id || i}>
                  {/* ================= ORDER TABLE ================= */}
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Status</th>
                        <th scope="col">Buyer</th>
                        <th scope="col">Date</th>
                        <th scope="col">Payment</th>
                        <th scope="col">Quantity</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr>
                        {/* Order Number */}
                        <td>{i + 1}</td>

                        {/* Order Status */}
                        <td>
                          <Select
                            bordered={false}
                            value={o?.status}
                            onChange={(value) => handleChange(o._id, value)}
                          >
                            {status.map((s, index) => (
                              <Option key={index} value={s}>
                                {s}
                              </Option>
                            ))}
                          </Select>
                        </td>

                        {/* Buyer */}
                        <td>{o?.buyer?.name || "Unknown"}</td>

                        {/* Date */}
                        <td>
                          {o?.createdAt ? moment(o.createdAt).fromNow() : "N/A"}
                        </td>

                        {/* Payment */}
                        <td>{o?.payment?.success ? "Success" : "Failed"}</td>

                        {/* Quantity */}
                        <td>{o?.products?.length || 0}</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* ================= PRODUCTS ================= */}
                  <div className="container">
                    {o?.products?.map((p, index) => (
                      <div
                        className="row mb-2 p-3 card flex-row"
                        key={p?._id || index}
                      >
                        {/* Product Image */}
                        <div className="col-md-4">
                          <img
                            src={`${import.meta.env.VITE_API}/api/v1/product/product-photo/${p._id}`}
                            className="card-img-top"
                            alt={p?.name || "Product"}
                            width="100px"
                            height="100px"
                          />
                        </div>

                        {/* Product Information */}
                        <div className="col-md-8">
                          <p>
                            <strong>{p?.name || "Product"}</strong>
                          </p>

                          <p>
                            {p?.description
                              ? p.description.substring(0, 30)
                              : "No description"}
                            {p?.description?.length > 30 ? "..." : ""}
                          </p>

                          <p>Price: {p?.price ?? 0}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminOrders;
