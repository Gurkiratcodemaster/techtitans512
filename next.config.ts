import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
const path = require("path");

module.exports = {
  outputFileTracingRoot: path.join(__dirname, "../"),
};
