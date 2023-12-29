# Poll Application RESTful API

This RESTful API serves as the backend for a poll application, enabling users to create, retrieve, and vote on polls. The API is designed using Node.js with Express and MySQL as the database.

## Installation

1. Clone this repository.
2. Install dependencies using `npm install`.
3. Set up the MySQL database and configure the connection in `config/db.js`.
4. Start the server using `npm start`.

## API Endpoints

### 1. Create Poll

- **Endpoint:** `POST /polls/createPolls`
- **Description:** Creates a new poll with multiple options.
- **Request Body:**
  ```json
  {
    "title": "Example Poll",
    "category": "Example Category",
    "startDate": "YYYY-MM-DD",
    "endDate": "YYYY-MM-DD",
    "minReward": 5,
    "maxReward": 10
  }

### 2. Fetch All Created Polls

- **Endpoint:** `GET /polls/getAllPolls`
- **Description:** Retrieves a list of all created polls with analytics.
- *Continue documenting other endpoints...*

### 3. User Data

- **Endpoint:** `POST /user/createUser`
- **Description:** Creates a new User.
- **Request Body**

```
{
    "name": "Your name"
}
```


## Models

- `Poll.model.js`: Functions to interact with polls in the database.
- `PollAnalytics.model.js`: Function to intract with analysis of polls.
- `Questions.model.js`: Function to interact with question sets. 
- `User.model.js`: Functions for user-related database interactions.

## Database Schema

The database schema includes tables for Users, Polls, Questions, Options, UserPolls, and PollAnalytics. Here's an overview:


