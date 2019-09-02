<h1>NC-NEWS

<h5>NC-NEWS is an api designed to provide access to articles and comments on a variety of topics. It also allows the user to filter the results in terms of users and comments, along with picking out key topics. 

<h5>Find a link to the hosted front end site below.

[Netlify hosted App](https://robs-fe-news-site.netlify.com) 

<h2>Getting started

<h5>For a full list of endpoints, use GET /API/. This will provide an overview of the available endpoints and actions that can be taken.

<h2>A link to the Heroku hosted app can be found here 

[Heroku App](https://robs-nc-news.herokuapp.com/)

<h2>Prerequisites

To clone the database to your local machine, use the GitHub URL - https://github.com/robertharry/ncnews-sprint.git .

<h5>The dependencies for the API are as follows.

>express ^4.17.1, knex ^7.19.1, postgres ^7.12.0

<h5>To install these follow the code below

```javascript
npm install express knex pg 
```

To perform the initial database setup, use

```javascript
npm run setup-dbs
```
You can then seed the database with
```javascript
npm run seed
```
This will insert the data into the database.

<h2>Author

<h3>Robert Harrison