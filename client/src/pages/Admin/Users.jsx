import React, { useEffect, useState } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import axios from "axios";
import toast from "react-hot-toast";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= GET ALL USERS =================
  const getAllUsers = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get("/api/v1/auth/users");

      if (data?.success) {
        setUsers(data?.users || []);
      } else {
        toast.error(data?.message || "Unable to get users");
      }
    } catch (error) {
      console.log(error);

      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ================= LIFECYCLE =================
  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <Layout title={"Dashboard - All Users"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          {/* ================= ADMIN MENU ================= */}
          <div className="col-md-3">
            <AdminMenu />
          </div>

          {/* ================= USERS ================= */}
          <div className="col-md-9">
            <h1 className="text-center mb-4">All Users</h1>

            {loading ? (
              <div className="text-center mt-5">
                <div className="spinner-border" role="status"></div>

                <p className="mt-3">Loading users...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center mt-5">
                <h4>No Users Found</h4>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Address</th>
                      <th>Role</th>
                      <th>Created</th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map((user, index) => (
                      <tr key={user._id}>
                        <td>{index + 1}</td>

                        <td className="fw-semibold">{user.name || "N/A"}</td>

                        <td>{user.email || "N/A"}</td>

                        <td>{user.phone || "N/A"}</td>

                        <td>{user.address || "N/A"}</td>

                        <td>
                          {user.role === 1 ? (
                            <span className="badge bg-danger">Admin</span>
                          ) : (
                            <span className="badge bg-primary">User</span>
                          )}
                        </td>

                        <td>
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!loading && users.length > 0 && (
              <p className="text-muted mt-3">
                Total Users: <strong>{users.length}</strong>
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Users;
