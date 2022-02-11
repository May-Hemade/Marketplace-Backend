import { Router } from "express"
import sequelize,{ Op } from "sequelize"
import Review from "../reviews/model.js"
import User from "../users/model.js"
import Category from "../categories/model.js"
import Product from "./model.js"

const productsRouter = Router()

productsRouter.get("/", async (req, res, next) => {
  try {
    const { offset = 0, limit = 3, category= "" } = req.query;
    const totalProduct = await Product.count({});
    const products = await Product.findAll({
      where:{},
      include: [{model: Review, include:[User]}, Category],
      offset,
      limit,
    })
    res.send({ data: products, count: totalProduct })
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})



productsRouter.get("/search", async (req, res, next) => {
  try {
    console.log({ query: req.query });
    const products = await Product.findAll({
      where: {
        [Op.or]: [
          {
            productName: {
              [Op.iLike]: `%${req.query.q}%`,
            },
          },
          {
            productDescription: {
              [Op.iLike]: `%${req.query.q}%`,
            },
          },
        ],
      },
      include: [{model: Review, include:[User]}, Category],
    });
    res.send(products);
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: error.message });
  }
});
productsRouter.get("/stats", async (req, res, next) => {
  try {
    console.log("here?")
    const stats = await Review.findAll({
     
      attributes: [
        [
          sequelize.cast(
            // cast function converts datatype
            sequelize.fn("count", sequelize.col("product_product_id")), // SELECT COUNT(blog_id) AS total_comments
            "integer"
          ),
          "numberOfReviews",
        ],
      ],
      group: ["product_product_id","product.product_id"],
      include: [ {model:Product,attributes:["productName"],include:[{model:Review,attributes:["comment"]}]}], // <-- nested include
    });
    res.send(stats);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});


productsRouter.post("/", async (req, res, next) => {
  try {
    const newProduct = await Product.create(req.body)
    if (req.body.categories) {
      for await (const categoryName of req.body.categories) {
        const category = await Category.create({ name: categoryName });
        await newProduct.addCategory(category, {
          through: { selfGranted: false },
        });
      }
    }

    const productWithCategory = await Product.findOne({
      where: { productId: newProduct.productId },
      include: [Category, Review],
    });

    res.send(productWithCategory)
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
})

productsRouter.put("/:id", async (req, res, next) => {
  try {
    const [success, updateProduct] = await Product.update(req.body, {
      where: { productId: req.params.id },
      returning: true,
    })
    if (success) {
      res.send(updateProduct)
    } else {
      res.status(404).send({ message: "no such product" })
    }
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
})
productsRouter.get("/:id", async (req, res, next) => {
  try {
    const singleProduct = await Product.findByPk(req.params.id)
    if (singleProduct) {
      res.send(singleProduct)
    } else {
      res.status(404).send({ error: "No such product" })
    }
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})
productsRouter.delete("/:id", async (req, res, next) => {
  try {
    await Product.destroy({
      where: {
        productId: req.params.id,
      },
    })
    res.status(204).send()
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
})


  

export default productsRouter
