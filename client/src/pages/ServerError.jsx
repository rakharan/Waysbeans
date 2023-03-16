import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
const ServerError = () => {
  return (
    <div className="min-h-screen">
      <LazyLoadImage src="/500.webp" effect="blur" />
    </div>
  );
};

export default ServerError;
