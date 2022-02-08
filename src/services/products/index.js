import express from "express"
import pool from "../../utils/db/connect.js"

import createHttpError from "http-errors"
import { validationResult } from "express-validator"
import { newProductValidation} from "./validation.js"
import multer from "multer"
import {
  getProducts,
  saveProductsImageUrl,
  writeProducts,
  productsPublicFolderPath,
} from "../../lib/fs-tools.js"

// CRUD
const productsRouter = express.Router()

productsRouter.get("/", async (req, res, next) => {
  try {
    let result = null
    if (req.query && req.query.category) {
      result = await pool.query(
        `SELECT * from products 
        JOIN reviews ON reviews.product_id=products.product_id
        WHERE product_category=$1;`,
        [req.query.category]
      )
    } else {
      result = await pool.query(`SELECT * from products 
      JOIN reviews ON reviews.product_id=products.product_id;`)
    }
    res.send(result.rows)
  } catch (error) {
    next(error)
  }
})

productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const productId = req.params.productId

    const result = await pool.query(
      `SELECT * from products WHERE product_id=$1;`,
      [productId]
    )

    if (result.rows[0]) {
      res.send(result.rows)
    } else {
      res.status(404).send({ message: "No such product." })
    }
  } catch (error) {
    next(error)
  }
})

productsRouter.post("/", newProductValidation, async (req, res, next) => {
  try {
    const errorsList = validationResult(req)
    if (errorsList.isEmpty()) {
      const result = await pool.query(
        `INSERT INTO products(product_name, product_description, product_price, product_category) 
        VALUES ($1, $2, $3, $4) RETURNING *;`,
        [
          req.body.product_name,
          req.body.product_description,
          req.body.product_price,
          req.body.product_category,
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
})

productsRouter.put("/:productId", async (req, res, next) => {
  try {
    const errorsList = validationResult(req)
    if (errorsList.isEmpty()) {
      const result = await pool.query(
        `UPDATE products SET product_name=$1, product_description=$2, product_price=$3, product_category=$4 
       WHERE product_id=$5
       RETURNING *;`,
        [
          req.body.product_name,
          req.body.product_description,
          req.body.product_price,
          req.body.product_category,
          req.params.productId,
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
})

productsRouter.delete("/:productId", async (req, res, next) => {
  try {
    await pool.query(`DELETE FROM products WHERE product_id=$1;`, [
      req.params.productId,
    ])
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

//Image post
productsRouter.post(
  "/:productsId/uploadImageUrl",
  multer().single("imageUrl"),
  async (req, res, next) => {
    // "imageUrl" does need to match exactly to the name used in FormData field in the frontend, otherwise Multer is not going to be able to find the file in the req.body
    try {
      console.log("FILE: ", req.file)
      await saveProductsImageUrl(req.file.originalname, req.file.buffer)
      const productId = req.params.productsId

      const productsArray = await getProducts()

      const index = productsArray.findIndex(
        (product) => product._id === productId
      )

      const oldProduct = productsArray[index]

      const updatedProduct = {
        ...oldProduct,
        imageUrl: "http://localhost:3001/img/products/" + req.file.originalname,
        updatedAt: new Date(),
      }

      productsArray[index] = updatedProduct

      await writeProducts(productsArray)

      res.send("Ok")
    } catch (error) {
      next(error)
    }
  }
)

productsRouter.get("/:productId/reviews", async (req, res, next) => {
  try {
    const productId = req.params.productId

    const result = await pool.query(
      `SELECT * FROM reviews 
      WHERE product_id=$1`,
      [productId]
    )

    res.send(result.rows)
  } catch (error) {
    next(error)
  }
})

export default productsRouter
