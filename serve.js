const express = require('express');
const { graphqlHTTP } = require('express-graphql');

const app = express();

// Contains all the information on how to get the data
const schema = require('./schema')

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));

app.listen(4000);
console.log('Listening on port 4000');
