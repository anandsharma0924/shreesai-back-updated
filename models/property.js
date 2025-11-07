module.exports = (sequelize, DataTypes) => {
  const Property = sequelize.define('Property', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    features: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    propertyType: {
      type: DataTypes.ENUM('sell', 'rent'),
      allowNull: false,
      defaultValue: 'sell',
    },
    status: {
      type: DataTypes.ENUM('available', 'sold', 'pending'),
      allowNull: false,
      defaultValue: 'available',
    },
    category: {
      type: DataTypes.ENUM('PG', 'Hostel', 'Room', 'Villa', 'Home'),
      allowNull: false,
      defaultValue: 'Home',
    },
    images: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    video: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return Property;
};
