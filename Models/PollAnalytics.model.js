const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const PollAnalytics = sequelize.define("PollAnalytics", {
    pollId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalVotes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    optionCount: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  });
  return PollAnalytics;
};
