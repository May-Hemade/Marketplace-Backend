import { body } from "express-validator";

export const newProductValidation = [
  body("product_name").exists().withMessage("product_name is a mandatory field!"),
  body("product_description").exists().withMessage("product_description is a mandatory field!"),
  body("product_category").exists().withMessage("product_category is a mandatory field!"),
  body("product_price").exists().withMessage("product_price is a mandatory field!"),
  //body("product_brand").exists().withMessage("product_brand is a mandatory field!"),
];