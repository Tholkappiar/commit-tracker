import axios from "axios";
import dotenv from "dotenv";
import { createLogger, transports, format } from "winston";
const { combine, timestamp, printf } = format;
import { eachLine } from "line-reader";

dotenv.config();
// GitHub API key
const GITHUB_API_KEY = process.env.GITHUB_API_KEY;
const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

// Axios instance with default headers with API Key
const axiosInstance = axios.create({
	headers: {
		Authorization: `Bearer ${GITHUB_API_KEY}`,
	},
});

// Configure Winston logger
const logger = createLogger({
	level: "info",
	format: combine(
		timestamp(),
		printf(
			({ level, message, timestamp }) => `${timestamp} [${level}]: ${message}`
		)
	),
	transports: [
		new transports.File({ filename: "error.log", level: "error" }),
		new transports.File({ filename: "error.log", level: "info" }),
	],
});

// Fetch the commit data using async and await
const fetch_event_data = async (USER) => {
	// API for commit events
	const EVENT_API = `https://api.github.com/users/${USER}/events`;
	try {
		// Get the Data from the API
		const { data } = await axiosInstance.get(EVENT_API);
		if (data && data.length > 0) {
			var date = new Date(data[0].created_at);
			if (check_commit(date)) {
				// check for the PushEvent
				// Format the data
				if (data[0].type == "PushEvent") {
					if (data[0].payload.commits[0]) {
						let message = formatted_Message(
							USER,
							data[0].repo.name,
							data[0].payload.commits[0].message
						);
						// Send the formatted Data
						send_commit_message(message, USER);
					} else {
						logger.info(`Something went wrong - ${USER}`);
					}
				} else {
					if (data[0]?.repo?.name) {
						let message = formatted_Message(
							USER,
							data[0].repo.name,
							`No code changes; Event ${data[0].type} ->`
						);
						// Send the formatted Data
						send_commit_message(message, USER);
					} else {
						logger.info(`Something went wrong - ${USER}`);
					}
				}
			} else {
				// console.log(`No commits for today - ${USER}`);
			}
		} else {
			logger.error(`No commits for ${USER}`);
		}
	} catch (err) {
		logger.error(`Error fetching data for ${USER}: ${err.message}`);
	}
};

// check the commit dates is equal to today's date
const check_commit = (date) => {
	// Date from the github API
	// Format today's date to "dd/mm/yyyy"
	const formattedCreatedAt = `${date.getDate().toString().padStart(2, "0")}/${(
		date.getMonth() + 1
	)
		.toString()
		.padStart(2, "0")}/${date.getFullYear()}`;

	const today = new Date();
	const todayDate = new Date(
		today.getFullYear(),
		today.getMonth(),
		today.getDate()
	);

	// Today's Date
	// Format today's date to "dd/mm/yyyy"
	let formattedToday = `${todayDate.getDate().toString().padStart(2, "0")}/${(
		todayDate.getMonth() + 1
	)
		.toString()
		.padStart(2, "0")}/${todayDate.getFullYear()}`;
	return formattedCreatedAt == formattedToday ? true : false;
};

// Format the Message and return the formatted message
const formatted_Message = (USER, repository, commit_message) => {
	const message = `${USER} committed today!\nLast Commit Message: ${commit_message}\nRepository: https://github.com/${repository}`;
	return message;
};

// Send the commit message to discord along with the commit url
const send_commit_message = async (message, USER) => {
	console.log(message);
	try {
		// Make a POST request to the webhook URL with message payload
		await axios.post(webhookUrl, { content: message });
		logger.info(`Message sent to Discord successfully, User ${USER}`);
	} catch (error) {
		logger.error("Error sending message to Discord:", error);
	}
};

eachLine("usernames.txt", function (line, last) {
	fetch_event_data(line);
});
