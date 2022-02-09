import { DataTypes } from "sequelize"

import sequelize from "../../utils/db/connect.js"

import Sequelize from "sequelize"

import Product from "../products/model.js"

const Review = sequelize.define(
  "review",
  {
    ReviewId: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
   rate: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { underscored: true }
)

Product.hasMany(Review, {
  onDelete: "CASCADE",
})

Review.belongsTo(Product)

export default Review
