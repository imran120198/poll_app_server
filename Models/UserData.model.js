const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define("User", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    votedQuestions: {
      type: DataTypes.TEXT,
      get() {
        const value = this.getDataValue("votedQuestions");
        return value ? JSON.parse(value) : [];
      },
      set(value) {
        this.setDataValue("votedQuestions", JSON.stringify(value));
      },
    },
  });
  return User;
};
