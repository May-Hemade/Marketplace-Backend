import Sequelize from "sequelize"

let options = {
  port: process.env.PGPORT,
  host: process.env.PGHOST,
  dialect: "postgres",
}

if (process.env.REQUIRE_SSL === "true") {
  options.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  }
}

const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
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
