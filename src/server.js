import express from "express";

//import productsRouter from "./services/products/index.js";

// import reviewsRouter from "./services/reviews/index.js";
import { authenticateDatabase } from "./utils/db/connect.js"

import "./services/products/model.js"

const server = express();

const { PORT = 3001 } = process.env;

// const publicFolderPath = join(process.cwd(), "public");


server.use(express.json());
// server.use(cors());

// server.use(express.static(publicFolderPath));
//ENDPOINTS

  // server.use("/products", productsRouter);
    //server.use("/reviews", reviewsRouter);

// server.use(badRequestHandler);
// server.use(unauthorizedHandler);
// server.use(notFoundHandler);
// server.use(genericErrorHandler);

// console.table(listEndpoints(server));

server.listen(PORT, () => {
  authenticateDatabase();
  console.log(`Server is listening on port ${PORT}`);
});

server.on("error", (error) => {
  console.log(`Server is stopped : ${error}`);
});