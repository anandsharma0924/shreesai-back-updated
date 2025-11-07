const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER, 
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  dialect: "mysql",
  logging: process.env.NODE_ENV === "development" ? console.log : false,
});

// Load models
const User = require("./user")(sequelize, DataTypes);
const SellEnquiry = require("./sellEnquiry")(sequelize, DataTypes);
const Property = require("./property")(sequelize, DataTypes);
const Land = require("./lands")(sequelize, DataTypes);
const MobileNumber = require("./number")(sequelize, DataTypes);
const Contact = require("./contact")(sequelize, DataTypes);

// Debug model loading
console.log('MobileNumber model loaded:', MobileNumber, typeof MobileNumber, Object.keys(MobileNumber));

// Define associations
User.hasMany(SellEnquiry, { foreignKey: "userId" });
SellEnquiry.belongsTo(User, { foreignKey: "userId" });

// Export all models
const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = User;
db.SellEnquiry = SellEnquiry;
db.Property = Property;
db.Land = Land;
db.MobileNumber = MobileNumber;
db.Contact = Contact;

module.exports = db;