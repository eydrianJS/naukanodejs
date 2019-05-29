const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");

const prapgQlSchema = require("./graphql/schema/index");
const prapgQlResolvers = require("./graphql/resolvers/index");

const app = express();

app.use(bodyParser.json());

app.use(
  "/graphql",
  graphqlHttp({
    schema: prapgQlSchema,
    rootValue: prapgQlResolvers,
    graphiql: true
  })
);

mongoose
  .connect(
    // `mongodb+srv://${process.env.MONGO_USER}:${
    //   process.env.MONGO_PASSWORD
    // }@graphqlcluster-3axar.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`,
    // { useNewUrlParser: true }
    'mongodb://localhost/test'
  )
  .then(() => {
    console.log("odpalam serwer");
    app.listen(3000);
  })
  .catch(err => {
    console.log("DUPA");
    console.log(err);
  });
