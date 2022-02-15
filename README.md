# Poll-Server
This is a repository of a backend server for a polling web app. Basically, Nodejs (Express Framework) and PostgreSQL had been used in this repo.

# Example of the vote campaign
Voting Campaign 1: Which is the best language?
Start: Jan 1, 2022      End: Feb 28, 2022
1. JavaScript             Vote: 234508
2. Java                   Vote: 128567
3. Python                 Vote: 178945

# Database Design
PostgreSQL is a relational database, before we build up the server, we need to consider how to liink up the table.
Below is the design of this repo,

<img width="644" alt="螢幕截圖 2022-02-14 上午2 59 28" src="https://user-images.githubusercontent.com/87925464/153770361-2e23d18b-6176-4e76-a129-6835d381a84f.png">

# Frontend
Reactjs is suggested to adopt for the frontend web application based on this repo.

# Installation
Installation from git
------------
```javascript
git clone git@github.com:JJJackie13/Poll-Server.git
```

Installation from yarn
------------
```javascript
yarn install
```

Installation of PostgreSQL
------------
Download PostgreSQL from the below link,
https://www.postgresql.org/download/

After the PostgreSQL had been installed, open the terminal and type the below code:
access postgreSQL by 
```javascript
psql
```
Create database by
```javascript
CREATE DATABASE <your-database-name>;
```
Create user
```javascript
CREATE USER <your-username> WITH PASSWORD '<your-password-here>' SUPERUSER;
```
Grant user 
```javascript
GRANT ALL PRIVILEGES ON DATABASE <your-database-name> TO <your-username>;
```

Run Knex Migration
------------
Please run the below code in terminal to generate table in Database.
```javascript
yarn knex migrate:latest
```
Rolling Back Knex Migration
------------
if error happen, run the below code in terminal to delete table in Database.
```javascript
yarn knex migrate:rollback 
```

Mock data
------------
Also, for mock data, please run the below code after the tables are created in database.
```javascript
yarn knex seed:run 
```

Create .env file
------------
Please create .env in Server file, put the related information in .env file.

# API
In this repo, mainly 7 API can be used. For the web users, 3 API had been created for login, logout and register function. This is because in this repo, we want to restrict the web users to poll only once vote on every single poll campaign by record their citizens ID.
And for the remainly 4 API, which 2 of them are to generate one for activated campaigns and one for ended campaigns. Another API is for access the campaign by their unique id. Therefore, when web users click on the list on activated / ended campaigns, the frontend side should be routed to campaign own page by using the campaign id. For the last one, it is an API for the post action for the web users to vote on the campaigns.

<img width="1359" alt="螢幕截圖 2022-02-15 上午10 59 13" src="https://user-images.githubusercontent.com/87925464/153984380-eaa846a8-e375-4cfc-8e68-9a498e5e653f.png">

# Swagger API
For the details of the API and data structure, please localhost the server and access the URL: http://localhost:8080/api-docs to enter the swagger API tool.

# Socket IO
Socket IO had been implement for the real time vote. A room method had been design, for each user click on unique campaign, they can see the real-time voting by other users based on the implementation of socketIO.

# Docker
A dockerfile is used for later implementation the server on AWS.

# Update
A update version had be uploaded for using knex to generate seed data for testing on 15 Feb 2022. For the testing, seed data need to be generated for the critical test case, and it will be provided on the upcoming version.
