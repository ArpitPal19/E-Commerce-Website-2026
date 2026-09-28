import React from "react";
import { Link } from "react-router-dom";
import useCategory from "../hooks/useCategory";
import Layout from "../components/Layout/Layout";

const Categories = () => {
  const categories = useCategory();

  return (
    <Layout title={"All Categories"}>
      <div className="container py-5">
        <h1 className="text-center mb-5">All Categories</h1>

        <div className="row g-4 justify-content-center">
          {categories?.map((c) => (
            <div className="col-lg-3 col-md-4 col-sm-6" key={c._id}>
              <Link
                to={`/category/${c.slug}`}
                className="btn btn-primary w-100 py-3"
                style={{
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "500",
                }}
              >
                {c.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
