import Sequelize from "sequelize"

const { DATABASE_URL } = process.env

// const sequelize = new Sequelize(DATABASE_URL, {
//   dialect: "postgres",
// });

let options = {
  port: process.env.PORT,
  host: process.env.HOST,
  dialect: "postgres",
}

if (process.env.REQUIRE_SSL === "true") {
  options.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: true,
    },
  }
}

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.USER,
  process.env.PASSWORD,
  options
)

export const authenticateDatabase = async () => {
  try {
    await sequelize.authenticate({ logging: false })
    await sequelize.sync({ alter: true, logging: false })
    console.log("Connection has been established successfully.")
  } catch (error) {
    console.log(error)
    console.error("Unable to connect to the database:", error)
  }
}

export default sequelize
