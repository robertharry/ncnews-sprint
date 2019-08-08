<h1>NC-NEWS

<h5>NC-NEWS is an api designed to provide access to articles and comments on a variety of topics. It also allows the user to filter the results in terms of users and comments, along with picking out key topics.

<h2>Getting started

<h5>For a full list of endpoints, use GET /API/. THis will provide an overview of the available endpoints and actions that can be taken.

<h2>Prerequisites

<h5>The dependencies for the API are as follows.

>express, knex, postgres

<h5>To install these follow the code below


```javascript
npm install express knex pg 
```

<h2>Running the tests

<h5>The tests in this case can be found in the **spec** folder. This folder includes the tests for the seeding of the database. To run the API tests run test, to run the utility function tests run test-utils.

```javascript
npm run test
npm run test-utils
```
<h5>These tests test the funcitonality of the endpoints described earlier, and ensure errors are handled appropriately.

<h2>Author

<h3>Robert Harrison