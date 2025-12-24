1. Project Overview
This project is a basic backend application developed using Node.js and MongoDB.
It starts a server and connects to a MongoDB database successfully.

2. System Requirements
Ensure the following software is installed on your system:
Node.js
MongoDB (Local or MongoDB Atlas)
Git
Code Editor (VS Code recommended)

*Project Setup
3.1 Open Project Directory
Open Command Prompt / Terminal and navigate to the project folder:
cd C:\Users\supri\OneDrive\supriya082
3.2 Install Dependencies
Run the following command to install required packages:
npm install
This will create a node_modules folder.

4. Running the Application
Execute the server using:
node server.js

5. Successful Execution Output
After running the command, the following messages confirm successful execution:
Server running at http://localhost:3019
MongoDB connected

6. Accessing the Application
Open any browser or API testing tool (Postman) and navigate to:
http://localhost:3019

7. Project Structure
project-folder/
│
├── server.js
├── package.json
├── package-lock.json
├── node_modules/
└── README.md

8. Notes
MongoDB driver warnings may appear due to deprecated options.
These warnings do not affect the application functionality.
The server runs locally on port 3019.
