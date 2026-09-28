import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import axios from "axios";

const Profile = () => {
  // Context
  const [auth, setAuth] = useAuth();

  // State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [answer, setAnswer] = useState("");

  // Get user data
  useEffect(() => {
    const user = auth?.user;

    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");

      // Do not display the existing security answer
      setAnswer("");
    }
  }, [auth?.user]);

  // Form submit function
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.put("/api/v1/auth/profile", {
        name,
        email,
        password,
        phone,
        address,
        answer,
      });

      if (data?.error) {
        toast.error(data.error);
      } else {
        // Update authentication context
        setAuth({
          ...auth,
          user: data.updatedUser,
        });

        // Update localStorage
        const ls = JSON.parse(localStorage.getItem("auth"));

        if (ls) {
          ls.user = data.updatedUser;
          localStorage.setItem("auth", JSON.stringify(ls));
        }

        // Clear sensitive fields after successful update
        setPassword("");
        setAnswer("");

        toast.success("Profile Updated Successfully");
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Something went wrong",
      );
    }
  };

  return (
    <Layout title={"Your Profile"}>
      <div className="container-fluid p-3 m-3">
        <div className="row">
          {/* User Menu */}
          <div className="col-md-3">
            <UserMenu />
          </div>

          {/* Profile Form */}
          <div className="col-md-9">
            <div className="form-container">
              <form onSubmit={handleSubmit}>
                <h4 className="title">USER PROFILE</h4>

                {/* Name */}
                <div className="mb-3">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-control"
                    placeholder="Enter Your Name"
                    required
                    autoFocus
                  />
                </div>

                {/* Email */}
                <div className="mb-3">
                  <input
                    type="email"
                    value={email}
                    className="form-control"
                    placeholder="Enter Your Email"
                    required
                    disabled
                  />
                </div>

                {/* New Password */}
                <div className="mb-3">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control"
                    placeholder="New Password (leave blank to keep current)"
                  />
                </div>

                {/* Phone */}
                <div className="mb-3">
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-control"
                    placeholder="Enter Your Phone"
                    required
                  />
                </div>

                {/* Address */}
                <div className="mb-3">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="form-control"
                    placeholder="Enter Your Address"
                    required
                  />
                </div>

                {/* Security Answer */}
                <div className="mb-3">
                  <input
                    type="password"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="form-control"
                    placeholder="New Security Answer (leave blank to keep current)"
                  />
                </div>

                {/* Update Button */}
                <button type="submit" className="btn btn-primary">
                  UPDATE
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
