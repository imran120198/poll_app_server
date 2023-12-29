const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const QuestionSet = sequelize.define("QuestionSet", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    pollId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    questionType: {
      type: DataTypes.ENUM("single", "multiple"),
      allowNull: false,
    },
    questionText: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    options: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  });
  return QuestionSet;
};
