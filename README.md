## Instructions

### 1. Setting Up Environment Variables

1. Navigate to the root directory of the project.
2. Create a new file named `.env`
3. Open the `.env` file in a text editor.
4. Add the following lines to the `.env` file, replacing `YOUR_VARIABLE` with the actual `GITHUB_API_KEY` and `DISCORD_WEBHOOK_URL` with the corresponding value:

   ```dotenv
   GITHUB_API_KEY=your_github_api_key_here
   DISCORD_WEBHOOK_URL=your_discord_webhook_url_here
   ```

5. Save the `.env` file.

### 2. Creating the `usernames.txt` File

1. Navigate to the root directory of the project.
2. Create a new file named `usernames.txt` if it doesn't already exist.
3. Open the `usernames.txt` file in a text editor.
4. Add each GitHub username on a separate line.

   ```plaintext
   user1
   user2
   user3
   ```

5. Save the `usernames.txt` file.

### 3. Installing Dependencies

Before running the project, make sure to install dependencies. Run the following command:

```bash
npm install
```

### 4. Running the Project

To run the project, execute the following command:

```bash
node cron.js
```
