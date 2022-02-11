import express from "express"
import cors from "cors"
import listEndpoints from "express-list-endpoints"

import productsRouter from "./services/products/index.js"
import usersRouter from "./services/users/index.js"

import reviewsRouter from "./services/reviews/index.js"
import { authenticateDatabase } from "./utils/db/connect.js"

import "./services/products/model.js"
import categoryRouter from "./services/categories/index.js"

const server = express()

const { PORT = 3001 } = process.env

const whiteListedOrigins = [process.env.FE_DEV_URL, process.env.FE_PROD_URL]

console.log("Permitted origins:")
console.table(whiteListedOrigins)

server.use(
  cors({
    origin: function (origin, next) {
      console.log("ORIGIN: ", origin)

      if (!origin || whiteListedOrigins.indexOf(origin) !== -1) {
        console.log("YAY!")
        next(null, true)
      } else {
        next(new Error("CORS ERROR!"))
      }
    },
  })
)

server.use(express.json())

server.use("/products", productsRouter)
server.use("/reviews", reviewsRouter)
server.use("/users", usersRouter)
server.use("/categories", categoryRouter)

console.table(listEndpoints(server))

server.listen(PORT, () => {
  authenticateDatabase()
  console.log(`Server is listening on port ${PORT}`)
})

server.on("error", (error) => {
  console.log(`Server is stopped : ${error}`)
})
