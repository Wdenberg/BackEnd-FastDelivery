import express from "express";
import mongoose from "mongoose";
require("dotenv").config();

const app = express();
//db
//router
//middleware

mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jcgpdjt.mongodb.net/${process.env.DB_DATABASE}`,
  {}
);

export default app;
