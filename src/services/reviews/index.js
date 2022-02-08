import express from "express"
import pool from "../../utils/db/connect.js"

import uniqid from "uniqid"
import createHttpError from "http-errors"
import { validationResult } from "express-validator"
import { newReviewValidation } from "./validation.js"
import {
  getProducts,
  saveProductsImageUrl,
  writeProducts,
  productsPublicFolderPath,
} from "../../lib/fs-tools.js"

const reviewsRouter = express.Router()

reviewsRouter.get("/", async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT * FROM reviews`
    )

    res.send(result.rows)
  } catch (error) {
    next(error)
  }
})

reviewsRouter.get("/:reviewId", async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT * FROM reviews 
      WHERE review_id=$1`,
      [req.params.reviewId]
    )

    if(result.rowCount > 0) {
      res.send(result.rows[0])
    } else {
      res.status(404).send({ message: "Review not found." })
    }
  } catch (error) {
    next(error)
  }
})

reviewsRouter.post("/",
  newReviewValidation,
  async (req, res, next) => {
    try {
      const errorsList = validationResult(req)
      if (errorsList.isEmpty()) {
        const result = await pool.query(
          `INSERT INTO reviews(comment, rate, product_id) 
          VALUES ($1, $2, $3) RETURNING *;`,
          [
            req.body.comment,
            req.body.rate,
            req.body.product_id
          ]
        )
        res.send(result.rows[0])
      } else {
        next(
          createHttpError(400, "Some errors occured in request body!", {
            errorsList,
          })
        )
      }
    } catch (error) {
      next(error)
    }
  }
)

reviewsRouter.put("/reviewId",
  newReviewValidation,
  async (req, res, next) => {
    try {
      const errorsList = validationResult(req)
      if (errorsList.isEmpty()) {
        const result = await pool.query(
          `UPDATE reviews SET comment=$1, rate=$2, product_id=$3) 
          VALUES ($1, $2, $3) RETURNING *;`,
          [
            req.body.comment,
            req.body.rate,
            req.body.product_id
          ]
        )
        res.send(result.rows[0])
      } else {
        next(
          createHttpError(400, "Some errors occured in request body!", {
            errorsList,
          })
        )
      }
    } catch (error) {
      next(error)
    }
  }
)

reviewsRouter.delete(
  "/:reviewId", async (req, res, next) => {
    try {
      await pool.query(`DELETE FROM reviews WHERE review_id=$1;`, [
        req.params.reviewId,
      ])
      res.status(204).send()
    } catch (error) {
      next(error)
    }
  }
)

export default reviewsRouter
