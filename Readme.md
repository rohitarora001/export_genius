# Basic Image Upload Platform - Backend

## Overview

This project implements the backend functionality of a basic image upload platform. It utilizes Node.js, Express, Prisma ORM, Redis for queueing images, and Socket.IO for real-time status updates.

## Features

1. **User Authentication**: Implemented user authentication using JWT-based tokens for secure access to the platform.
2. **Image Upload**: Allowed users to upload images to the platform.
3. **Image Processing**: Implemented basic image processing to resize to 400 x 400 (using cloudinary) and convert to PNG (using sharp) format. Use Jobs and Queues with Redis to handle image processing with a limit of 2 images at one time.
4. **Image Storage**: Stored image metadata and file paths in a MySQL database using Prisma ORM for efficient data management.
5. **Scheduled Image Publication**: Enabled users to schedule the publication of their uploaded images at specific times in the future. Utilized Cron Jobs (node-schedule npm package) to automate the process of publishing scheduled images at the specified times.
6. **Image Retrieval**: Provide endpoints to retrieve and display images to users efficiently.
7. **API Security**: Applied appropriate security measures such as rate-limiting, and input validation to safeguard the API endpoints.
8. **User Profile**: Allowed users to view their uploaded images.
9. **Redis**: Utilized Redis for queuing images and processing them one by one.
10. **Socket.IO**: Implemented Socket.IO for real-time status updates of images.
11. **Rate Limiting**: Used Express-Rate-Limiting package to limit the number of API hits to enhance security and prevent abuse.

## Technologies

- Node.js
- Express
- Prisma ORM
- MySQL
- Redis
- Socket.IO
- Express Rate Limiting

## Local Development

### Setup

1. Clone the repository: git clone <repository-url>
2. Navigate to the backend directory: cd <backend-directory>
3. Install dependencies: **npm install**

### Run Locally

- Use the following command to run the app locally: **npm start**
- The app will listen on port 4000 for both the application and Socket.IO connections. Open your browser and navigate to [http://localhost:4000] to access the backend.


### Live :

Deployed Url : https://export-genius-backend.onrender.com