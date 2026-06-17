import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env["CLOUDINARY_CLOUD_NAME"] ?? "dg7400fxz",
  api_key: process.env["CLOUDINARY_API_KEY"] ?? "693423314473277",
  api_secret: process.env["CLOUDINARY_API_SECRET"],
});

export default cloudinary;
