import { DataTypes } from "sequelize";
import sequelize from "../../utils/db/connect.js";
import Sequelize from "sequelize";


const Product = sequelize.define(
  "product",
  {
    productId: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productDescription: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "https://i.pravatar.cc/300",
      validate: {
        isURL: true,
      },
    },
  },
  { underscored: true }
)

export default Product
