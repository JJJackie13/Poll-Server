# Poll-Server
This is a repository of a backend server for a polling web app. Basically, Nodejs (Express Framework) and PostgreSQL had been used in this repo.

# Database Design
PostgreSQL is a relational database, before we build up the server, we need to consider how to liink up the table.
Below is the design of this repo,

<img width="682" alt="螢幕截圖 2022-02-01 下午8 28 15" src="https://user-images.githubusercontent.com/87925464/151968555-f3634454-7171-4a1c-b752-d153b1d3f849.png">

# Frontend
Reactjs is suggested to adopt for the frontend web application based on this repo.

# API
In this repo, mainly 7 API can be used. For the web users, 3 API had been created for login, logout and register function. This is because in this repo, we want to restrict the web users to poll only once vote on every single poll campaign by record their citizens ID.
And for the remainly 4 API, which 2 of them are to generate one for activated campaigns and one for ended campaigns. Another API is for access the campaign by their unique id. Therefore, when web users click on the list on activated / ended campaigns, the frontend side should be routed to campaign own page by using the campaign id. For the last one, it is an API for the post action for the web users to vote on the campaigns.

<img width="1353" alt="螢幕截圖 2022-02-01 下午9 01 19" src="https://user-images.githubusercontent.com/87925464/151973187-d1b8a061-d8a6-4b2f-ab9e-7b32a1f855e1.png">

# Swagger API
For the details of the API and data structure, please localhost the server and access the URL: http://localhost:8080/api-docs to enter the swagger API tool.

# Socket IO
Socket IO had been implement for the real time vote. A room method had been design, for each user click on unique campaign, they can see the real-time voting by other users based on the implementation of socketIO.

# Docker
A dockerfile is used for later implementation the server on AWS.

# Update
A update version will be uploaded later for using knex to generate seed data for testing. Also, for the testing, seed data need to be generated for the critical test case, and it will be provided on the upcoming version.
