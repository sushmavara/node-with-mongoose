# node-js

# This gives overview of using node js with Sequelize with dialect mysql

# have SQL Community Server and workbench installed

# Before running the project we need to make sure db "shop" is created in SQL workbench

# utils/database will take care of configuring "sequelize" with "shop" database

# do npm install and run npm start to start the server open localhost: http://localhost:3000/

# for creating the tables for the first time run app.sync({force: true}) in app.js - once its successful then override force to false - This will make sure the tables are created in the shop db 
