import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      className="footer"
      style={{
        margin: 0,
        paddingBottom: "30px",
      }}
    >
      <h1 className="text-center mb-0">All Right Reserved &copy; Arpit Pal</h1>

      <p className="text-center mt-3 mb-0">
        <Link to="/about">About</Link>
        {" | "}
        <Link to="/contact">Contact</Link>
        {" | "}
        <Link to="/policy">Privacy Policy</Link>
      </p>
    </footer>
  );
};

export default Footer;
