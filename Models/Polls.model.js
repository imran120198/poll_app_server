const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Polls = sequelize.define("Poll", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    minReward: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    maxReward: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return Polls;
};
