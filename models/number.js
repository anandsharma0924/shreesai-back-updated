module.exports = (sequelize, DataTypes) => {
  const MobileNumber = sequelize.define(
    'MobileNumber',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      number: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Number cannot be empty' },
          is: { args: /^[0-9]{10}$/, msg: 'Number must be a valid 10-digit phone number' },
        },
      },
      is_delete: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: 'MobileNumbers',
      timestamps: true,
    }
  );
  return MobileNumber;
};