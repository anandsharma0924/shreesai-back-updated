const sanitizeHtml = require('sanitize-html');

module.exports = (sequelize, DataTypes) => {
  const SellEnquiry = sequelize.define(
    'SellEnquiry',
    {
      propertyType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: 'Property type is required' } },
      },
      propertySubType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: 'Property subtype is required' } },
      },
      transactionType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: {
            args: [['Sell', 'Rent']],
            msg: 'Transaction type must be Sell or Rent',
          },
        },
      },
      propertyName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: 'Property name is required' } },
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: 'Location is required' } },
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: { min: { args: 0.01, msg: 'Price must be greater than 0' } },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: { notEmpty: { msg: 'Description is required' } },
        set(value) {
          this.setDataValue('description', sanitizeHtml(value));
        },
      },
      bedrooms: { type: DataTypes.INTEGER, allowNull: true },
      bathrooms: { type: DataTypes.INTEGER, allowNull: true },
      area: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: { min: { args: 0.01, msg: 'Area must be greater than 0' } },
      },
      furnishingStatus: { type: DataTypes.STRING, allowNull: true },
      floorNumber: { type: DataTypes.INTEGER, allowNull: true },
      totalFloors: { type: DataTypes.INTEGER, allowNull: true },
      availabilityStatus: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: {
            args: [['Ready to move', 'Under construction', 'Available from']],
            msg: 'Availability status must be Ready to move, Under construction, or Available from',
          },
        },
      },
      availableFrom: { type: DataTypes.DATEONLY, allowNull: true },
      parkingAvailability: { type: DataTypes.STRING, allowNull: true },
      parkingType: { type: DataTypes.STRING, allowNull: true },
      facingDirection: { type: DataTypes.STRING, allowNull: true },
      ageOfProperty: { type: DataTypes.STRING, allowNull: true },
      plotLength: { type: DataTypes.FLOAT, allowNull: true },
      plotWidth: { type: DataTypes.FLOAT, allowNull: true },
      plotUnit: { type: DataTypes.STRING, allowNull: true },
      roadWidth: { type: DataTypes.FLOAT, allowNull: true },
      roadUnit: { type: DataTypes.STRING, allowNull: true },
      ownershipType: { type: DataTypes.STRING, allowNull: true },
      registryAvailable: { type: DataTypes.BOOLEAN, allowNull: true },
      reraId: { type: DataTypes.STRING, allowNull: true },
      taxPaidUpto: { type: DataTypes.STRING, allowNull: true },
      waterSupply: { type: DataTypes.STRING, allowNull: true },
      electricityAvailable: { type: DataTypes.BOOLEAN, allowNull: true },
      sewageAvailable: { type: DataTypes.STRING, allowNull: true },
      roadConnectivity: { type: DataTypes.STRING, allowNull: true },
      suitableFor: { type: DataTypes.STRING, allowNull: true },
      nearbyLandmarks: { type: DataTypes.JSON, allowNull: true, defaultValue: [] },
      amenities: { type: DataTypes.JSON, allowNull: true, defaultValue: [] },
      nearbyFacilities: {
        type: DataTypes.STRING,
        allowNull: true,
        set(value) {
          this.setDataValue('nearbyFacilities', value ? sanitizeHtml(value) : null);
        },
      },
      sellerType: { type: DataTypes.STRING, allowNull: true },
      latitude: { type: DataTypes.FLOAT, allowNull: true },
      longitude: { type: DataTypes.FLOAT, allowNull: true },
      propertyImages: { type: DataTypes.JSON, allowNull: true, defaultValue: [] },
      document: { type: DataTypes.STRING, allowNull: true },
      verificationDocs: { type: DataTypes.JSON, allowNull: true, defaultValue: [] },
      contactName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: 'Contact name is required' } },
      },
      contactEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { isEmail: { msg: 'Valid email is required' } },
      },
      contactMobile: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: { args: /^\+?\d{10,15}$/, msg: 'Mobile number must be 10-15 digits' },
        },
      },
    },
    {
      tableName: 'sell_enquiries',
      timestamps: true,
    }
  );

  // Hooks
  SellEnquiry.addHook('beforeValidate', (instance) => {
    if (instance.availabilityStatus === 'Available from' && !instance.availableFrom) {
      throw new Error('Available from date is required when availability status is "Available from"');
    }
  });

  return SellEnquiry;
};