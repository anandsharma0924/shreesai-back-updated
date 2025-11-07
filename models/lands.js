module.exports = (sequelize, DataTypes) => {
  const Land = sequelize.define(
    "Land",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      category: {
        type: DataTypes.ENUM('Land', 'Commercial', 'Industrial', 'Investment', 'Residential'),
        allowNull: false,
      },
      transactionType: {
        type: DataTypes.ENUM('Sell', 'Buy', 'Rent'),
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      pincode: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      price: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      area: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      plotSize: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      buildingType: {
        type: DataTypes.ENUM('Office', 'Shop', 'Warehouse', 'Factory', 'Other'),
        allowNull: true,
      },
      investmentType: {
        type: DataTypes.ENUM('Rental', 'Resell', 'Development', 'Other'),
        allowNull: true,
      },
      propertyAge: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      floorNumber: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      totalFloors: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      parking: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      furnishedStatus: {
        type: DataTypes.ENUM('Furnished', 'Semi-Furnished', 'Unfurnished'),
        allowNull: true,
      },
      videoUrl: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      imageUrls: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      amenities: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('Available', 'Sold', 'Under Offer', 'Rented', 'Pending'),
        allowNull: false,
        defaultValue: 'Available',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "Lands",
      timestamps: true,
      indexes: [
        { fields: ['category', 'transactionType', 'price'] },
        { fields: ['city', 'state', 'pincode'] },
      ],
    }
  );

  return Land;
};
