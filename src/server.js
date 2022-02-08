import express from "express";
import listEndpoints from "express-list-endpoints";
import productsRouter from "./services/products/index.js";
import {
  badRequestHandler,
  unauthorizedHandler,
  notFoundHandler,
  genericErrorHandler,
} from "./errorHandlers.js";
import cors from "cors";
import { join } from "path";
import reviewsRouter from "./services/reviews/index.js";

const server = express();

const port = 3001;

const publicFolderPath = join(process.cwd(), "public");


server.use(express.json());
server.use(cors());

server.use(express.static(publicFolderPath));
//ENDPOINTS

server.use("/products", productsRouter);
server.use("/reviews", reviewsRouter);

server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

console.table(listEndpoints(server));

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
