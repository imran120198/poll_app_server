const express = require("express");
const PollRouter = express.Router();
const database = require("../Models/index");

// Now you can access the Sequelize instance and models
const sequelize = database.sequelize;
const Poll = database.Poll;
const QuestionSet = database.QuestionSet;
const PollAnalytics = database.PollAnalytics;

// Create a new poll with question sets
PollRouter.post("/createPolls", async (req, res) => {
  try {
    const {
      title,
      category,
      startDate,
      endDate,
      minReward,
      maxReward,
      questionSets,
    } = req.body;

    // Create a new poll
    const poll = await Poll.create({
      title,
      category,
      startDate,
      endDate,
      minReward,
      maxReward,
    });
    // Create a new PollAnalytics instance for the created poll
    const pollAnalytics = await PollAnalytics.create({
      pollId: poll.id,
      totalVotes: 0, // Initialize totalVotes to 0
      optionCounts: {}, // Initialize optionCounts to an empty object
    });

    const createdQuestionSets = await QuestionSet.bulkCreate(
      questionSets.map((set) => ({ ...set, pollId: poll.id }))
    );

    // Assuming you want to associate the question sets with the poll
    await poll.addQuestionSets(createdQuestionSets);

    res.status(201).json({ message: "Poll created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Endpoint for fetching all polls with analytics
PollRouter.get("/getAllPolls", async (req, res) => {
  try {
    const polls = await Poll.findAll({
      include: [
        {
          model: PollAnalytics,
          as: "PollAnalyticss",
        },
      ],
    });

    res.status(200).json({ polls });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Endpoint for updating a particular poll
PollRouter.put("/updatePolls/:pollId", async (req, res) => {
  try {
    const { pollId } = req.params;

    const { title, category, startDate, endDate, minReward, maxReward } =
      req.body;

    // Find the poll by id
    const pollToUpdate = await Poll.findatabaseyPk(pollId);

    // Update poll details if provided
    if (title) pollToUpdate.title = title;
    if (category) pollToUpdate.category = category;
    if (startDate) pollToUpdate.startDate = startDate;
    if (endDate) pollToUpdate.endDate = endDate;
    if (minReward) pollToUpdate.minReward = minReward;
    if (maxReward) pollToUpdate.maxReward = maxReward;

    // Save the updated poll
    await pollToUpdate.save();

    res
      .status(200)
      .json({ message: "Poll updated successfully", poll: pollToUpdate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

PollRouter.get("/polls/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch user polls along with associated questions
    const userPolls = await Poll.findAll({
      where: { userId },
      include: [
        {
          model: QuestionSet,
          as: "QuestionSets",
        },
      ],
    });

    // Check if the user has polls
    if (!userPolls || userPolls.length === 0) {
      return res.status(404).json({ message: "User or polls not found" });
    }

    // Extract the first poll and its associated question sets
    const firstPoll = userPolls[0];

    if (!firstPoll.QuestionSets || firstPoll.QuestionSets.length === 0) {
      return res
        .status(404)
        .json({ message: "No questions found for the first poll" });
    }

    const questions = firstPoll.QuestionSets.map((questionSet) => ({
      pollId: firstPoll.id,
      questionSetId: questionSet.id,
      questionSetText: questionSet.questionText,
      options: questionSet.options,
    }));

    res.status(200).json({ questions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Endpoint for submitting a poll
PollRouter.post("/polls/submit/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { id, questionSetId, selectedOptionValue } = req.body;

    // Find the user and the specified poll
    const user = await database.User.findatabaseyPk(userId);

    const poll = await Poll.findatabaseyPk(id, {
      include: [
        {
          model: QuestionSet,
          as: "QuestionSets",
        },
      ],
    });

    if (!user || !poll) {
      return res.status(404).json({ message: "User or Poll not found" });
    }

    // Check if the question exists in the poll

    const questionSet = poll.QuestionSets.find(
      (qSet) => qSet.id == questionSetId
    );

    if (!questionSet) {
      return res
        .status(404)
        .json({ message: "Question not found in the specified poll" });
    }

    // Check if the selected option exists in the question

    const selectedOption = questionSet.options.find(
      (option) => option === selectedOptionValue
    );

    if (!selectedOption) {
      return res.status(404).json({
        message: "Selected option not found in the specified question",
      });
    }

    // Check if the user has already answered this question
    const hasAnswered = user.votedQuestions.some(
      (votedQuestion) => votedQuestion === questionSetId
    );

    if (hasAnswered) {
      return res
        .status(400)
        .json({ message: "User has already answered this question" });
    }

    // Update user's votedQuestions
    user.votedQuestions.push(questionSetId);
    await user.save();

    // Calculate a random reward within the specified range
    const reward =
      Math.floor(Math.random() * (poll.maxReward - poll.minReward + 1)) +
      poll.minReward;

    // Fetch the PollAnalytics instance based on some condition
    const pollAnalyticsInstance = await PollAnalytics.findOne({
      where: { pollId: id },
    });

    if (pollAnalyticsInstance) {
      // Increment totalVotes by 1
      pollAnalyticsInstance.increment("totalVotes");
      // Increment the count for the selected option

      const selectedOptionId = selectedOption;

      pollAnalyticsInstance.optionCounts[selectedOptionId] =
        (pollAnalyticsInstance.optionCounts[selectedOptionId] || 0) + 1;
    } else {
      console.log("PollAnalytics instance not found");
    }
    await pollAnalyticsInstance.save();

    res.status(200).json({ message: "Poll submitted successfully", reward });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Endpoint for fetching poll analytics for a particular poll
PollRouter.get("/polls/:pollId/analytics", async (req, res) => {
  try {
    const { pollId } = req.params;

    // Find the specified poll with analytics
    const poll = await PollAnalytics.findOne({ where: { pollId } });

    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    res.status(200).json({ pollAnalytics: poll });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = { PollRouter };
