# Blog application
> Blog application

## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Setup](#setup)

## General Info

Blog application, created as part of "Processing Data in Cloud Computationg" classes. It allows to start own blog, write posts, read other users posts and comment them.

## Technologies

Project is created with:
* React 17 
* AntDesign 4
* Node.js 12
* Express
* Neo4J

## Setup

Go to server directory, change name of `.env.dist` file to `.env` and fill information about your instance of Neo4J database 
(e.x bolt://xxx.xxx.xxx.xx:7687, user, password), port on which backend should be running (e.x. 8080) and JWT secret key (e.x. secret). 
Then go to client directory and fill information in `.env` file about URL address of your backend (e.x. http://localhost:8080). 

Then install project locally using npm:

```
$ cd server
$ npm install
$ npm start
$ cd ../client
$ npm install
$ npm start
```

## Features
List of features ready and TODOs for future development
* Logging in / Registration
* Adding / Editting posts
* Marking posts as published / unpublished
* Formatting style of post
* Reading blogs of all users
* Commenting posts

## Status
Project is: finished

## Contact
Created by [@estewui](https://www.linkedin.com/in/stanis%C5%82aw-t%C4%99czy%C5%84ski-007153188/) - feel free to contact me!
