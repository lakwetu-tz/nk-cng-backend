# NCG-LMS API

## Introduction

This project is a Node.js backend application. This README provides instructions for setting up and running the application using three different methods: creating a daemon on a Linux server, spinning up a Docker container, or using PM2.

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- Docker (optional, for Docker setup)
- PM2 (optional, for PM2 setup)

## 1. Running as a Daemon on a Linux Server

### Step 1: Clone the repository
    git clone https://github.com/coders-tz/ncg-backend.git
    cd ncg-backend
    

### Step 2: Install dependencies

    npm install

### Step 3: Create a systemd service
Create a new service file for your application:

    sudo nano /etc/systemd/system/your-app.service

Add the following content to the file:

    ini
    Copy code
    [Unit]
    Description=Your App Description
    After=network.target

    [Service]
    ExecStart=/usr/bin/node /path/to/your/app/index.js
    WorkingDirectory=/path/to/your/app
    Restart=always
    User=your-username
    Group=your-groupname
    Environment=PATH=/usr/bin:/usr/local/bin
    Environment=NODE_ENV=production
    RestartSec=10

    [Install]
    WantedBy=multi-user.target

Replace /path/to/your/app, your-username, and your-groupname with appropriate values.

### Step 4: Start and enable the service

    sudo systemctl daemon-reload
    sudo systemctl start your-app
    sudo systemctl enable your-app

## 2. Running with Docker
### Step 1: Clone the repository

    git clone https://github.com/your-repo/project-name.git
    cd project-name
### Step 2: Build the Docker image

    docker-compose build
### Step 3: Run the Docker container

    docker-compose up

Your application should now be running in a Docker container and accessible on port 3000.

## 3. Running with PM2
### Step 1: Clone the repository

    git clone https://github.com/your-repo/project-name.git
    cd project-name
### Step 2: Install dependencies

    npm install
### Step 3: Install PM2 globally

    npm install pm2@latest -g

### Step 4: Start the application with PM2

    pm2 start index.js --name "your-app-name"

### Step 5: Save the PM2 process list and set it to start on boot

    pm2 save
    pm2 startup

Follow the instructions that appear to enable PM2 startup on boot.

## Additional Information
 - Logs: To view logs, use pm2 logs your-app-name or check the logs for the systemd service with journalctl -u your-app.
 - Monitoring: PM2 provides a monitoring dashboard with pm2 monit.

## Conclusion
You now have three different methods to get the backend up and running. Choose the one that best suits your deployment environment.