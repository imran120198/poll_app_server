// Creating relationships

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const Basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];

const database = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

// Import models and define associations
const Poll = require("./Polls.model")(sequelize);
const QuestionSet = require("./Questions.model")(sequelize);
const PollAnalytics = require("./PollAnalytics.model")(sequelize);
const User = require("./UserData.model")(sequelize);

// Define associations
Poll.hasMany(QuestionSet, { foreignKey: "pollId", as: "QuestionSets" });
QuestionSet.belongsTo(Poll);

// PollAnalytics associations
Poll.hasOne(PollAnalytics);
PollAnalytics.belongsTo(Poll);

// QuestionSet associations
QuestionSet.belongsTo(Poll);

// User associations
User.hasMany(Poll, { foreignKey: "id", as: "polls" });
Poll.belongsTo(User);

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== Basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    database[model.name] = model;
  });

Object.keys(database).forEach((modelName) => {
  if (database[modelName].associate) {
    database[modelName].associate(database);
  }
});

// Export the models and Sequelize instance
database.Poll = Poll;
database.QuestionSet = QuestionSet;
database.User = User;
database.PollAnalytics = PollAnalytics;
database.sequelize = sequelize;
database.Sequelize = Sequelize;

module.exports = database;
