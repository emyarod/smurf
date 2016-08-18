# smurf

Gathers Steam account and game stats for each player in a given CS:GO server.

![Sample output](https://i.imgur.com/M8dIegI.png)

# Setup & installation

1. Clone or download the repository

2. Run `npm install` in the project directory

3. Set the Node.JS environment variable `STEAM_API_KEY` to your Steam API key

4. `npm run` to start the server on `localhost:5000`

# Usage

Type `status` in the CS:GO console and paste the output to the input form on `localhost:5000`.

Blank values indicate that the statistic is undefined or that the user's profile is private.

If the VAC value is `true`, then the user has at least 1 VAC ban on record.