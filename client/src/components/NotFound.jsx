import React from "react";
import { Link } from "react-router-dom";
import error404 from "/error404.webp";
import Button from "../parts/Button";
const NotFound = () => {
  return (
    <div className="min-h-screen w-full items-center flex justify-center flex-col">
      <img
        src={error404}
        alt="not found page"
        className="w-[400px] max-w-full object-cover"
      />
      <h1>Page under construction</h1>
      <Button className="bg-[#289d5e] text-white hover:bg-[#71CA9B]/80">
        <Link to="/" className="text-xs">
          Back to home
        </Link>
      </Button>
    </div>
  );
};

export default NotFound;
