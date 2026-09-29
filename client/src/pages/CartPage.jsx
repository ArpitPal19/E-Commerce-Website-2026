import React, { useEffect, useRef, useState } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import dropin from "braintree-web-drop-in";
import axios from "axios";
import toast from "react-hot-toast";

const CartPage = () => {
  const [auth] = useAuth();
  const [cart, setCart] = useCart();

  const [clientToken, setClientToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [dropinReady, setDropinReady] = useState(false);

  const dropinInstance = useRef(null);
  const dropinContainer = useRef(null);

  const navigate = useNavigate();

  // Total price
  const totalPrice = () => {
    try {
      let total = 0;

      cart?.forEach((item) => {
        total += Number(item.price) || 0;
      });

      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    } catch (error) {
      console.log(error);
      return "$0.00";
    }
  };

  // Remove item from cart
  const removeCartItem = (pid) => {
    try {
      const myCart = [...cart];

      const index = myCart.findIndex((item) => item._id === pid);

      if (index !== -1) {
        myCart.splice(index, 1);
      }

      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));

      toast.success("Product removed from cart");
    } catch (error) {
      console.log(error);
    }
  };

  // Get Braintree client token
  const getToken = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/braintree/token");

      if (data?.clientToken) {
        setClientToken(data.clientToken);
      }
    } catch (error) {
      console.log("Braintree token error:", error);

      setClientToken("");
    }
  };

  // Get token when logged in
  useEffect(() => {
    if (auth?.token) {
      getToken();
    }
  }, [auth?.token]);

  // Create Braintree Drop-in UI
  useEffect(() => {
    if (!clientToken || !cart?.length || !dropinContainer.current) {
      return;
    }

    let cancelled = false;

    const createDropin = async () => {
      try {
        setDropinReady(false);

        // Remove previous instance if it exists
        if (dropinInstance.current) {
          await dropinInstance.current.teardown();
          dropinInstance.current = null;
        }

        // Clear container
        dropinContainer.current.innerHTML = "";

        const instance = await dropin.create({
          authorization: clientToken,
          container: dropinContainer.current,
          paypal: {
            flow: "vault",
          },
        });

        if (cancelled) {
          await instance.teardown();
          return;
        }

        dropinInstance.current = instance;
        setDropinReady(true);
      } catch (error) {
        console.log("Braintree Drop-in error:", error);
        toast.error("Unable to load payment gateway");
      }
    };

    createDropin();

    return () => {
      cancelled = true;

      if (dropinInstance.current) {
        dropinInstance.current.teardown().catch(() => {});
        dropinInstance.current = null;
      }
    };
  }, [clientToken, cart?.length]);

  // Handle payment
  const handlePayment = async () => {
    try {
      if (!dropinInstance.current) {
        toast.error("Payment system is not ready");
        return;
      }

      if (!auth?.user?.address) {
        toast.error("Please add your address first");
        return;
      }

      if (!cart?.length) {
        toast.error("Your cart is empty");
        return;
      }

      setLoading(true);

      const payload = await dropinInstance.current.requestPaymentMethod();

      await axios.post("/api/v1/product/braintree/payment", {
        nonce: payload.nonce,
        cart,
      });

      localStorage.removeItem("cart");
      setCart([]);

      toast.success("Payment Completed Successfully");

      navigate("/dashboard/user/orders");
    } catch (error) {
      console.log("Payment error:", error);

      toast.error(
        error?.response?.data?.message || "Payment failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container">
        {/* Header */}
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-1">
              {auth?.token ? `Hello ${auth?.user?.name}` : "Your Cart"}
            </h1>

            <h4 className="text-center">
              {cart?.length
                ? `You have ${cart.length} ${
                    cart.length === 1 ? "item" : "items"
                  } in your cart${
                    auth?.token ? "" : ". Please login to checkout."
                  }`
                : "Your Cart Is Empty"}
            </h4>
          </div>
        </div>

        <div className="row">
          {/* Cart Products */}
          <div className="col-md-8">
            {cart?.map((p) => (
              <div className="row mb-2 p-3 card flex-row" key={p._id}>
                <div className="col-md-4">
                  <img
                    src={`${import.meta.env.VITE_API}/api/v1/product/product-photo/${p._id}`}
                    className="card-img-top"
                    alt={p.name}
                    width="100px"
                    height="100px"
                  />
                </div>

                <div className="col-md-8">
                  <p>
                    <strong>{p.name}</strong>
                  </p>

                  <p>
                    {p.description?.substring(0, 30)}
                    {p.description?.length > 30 ? "..." : ""}
                  </p>

                  <p>Price: ${p.price}</p>

                  <button
                    className="btn btn-danger"
                    onClick={() => removeCartItem(p._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="col-md-4 text-center">
            <h2>Cart Summary</h2>

            <p>Total | Checkout | Payment</p>

            <hr />

            <h4>Total: {totalPrice()}</h4>

            {/* Address */}
            {auth?.user?.address ? (
              <div className="mb-3">
                <h4>Current Address</h4>

                <h5>{auth.user.address}</h5>

                <button
                  className="btn btn-outline-warning"
                  onClick={() => navigate("/dashboard/user/profile")}
                >
                  Update Address
                </button>
              </div>
            ) : (
              <div className="mb-3">
                {auth?.token ? (
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Add Address
                  </button>
                ) : (
                  <button
                    className="btn btn-outline-warning"
                    onClick={() =>
                      navigate("/login", {
                        state: "/cart",
                      })
                    }
                  >
                    Please Login to Checkout
                  </button>
                )}
              </div>
            )}

            {/* Payment */}
            <div className="mt-2">
              {!auth?.token ? (
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    navigate("/login", {
                      state: "/cart",
                    })
                  }
                >
                  Login to Checkout
                </button>
              ) : !cart?.length ? (
                ""
              ) : !clientToken ? (
                <p className="text-danger">
                  Payment gateway is not configured.
                </p>
              ) : (
                <>
                  <div ref={dropinContainer} className="text-start mb-3" />

                  <button
                    className="btn btn-primary"
                    onClick={handlePayment}
                    disabled={loading || !dropinReady || !auth?.user?.address}
                  >
                    {loading ? "Processing..." : "Make Payment"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
