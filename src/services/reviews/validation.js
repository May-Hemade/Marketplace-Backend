import { body } from "express-validator";

export const newReviewValidation = [
  body("product_id").exists().withMessage("product_id is a mandatory field!"),
  body("comment").exists().withMessage("comment is a mandatory field!"),
  body("rate").exists().withMessage("rate is a mandatory field!").isNumeric({min: 0, max:5}),
];