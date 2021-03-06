const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");

const graphQlSchema = require("./graphql/schema/index");
const graphQlResolvers = require("./graphql/resolvers/index");
const isAuth = require("./middleware/is-auth")

const app = express();

app.use(bodyParser.json());


app.use(isAuth);

app.use(
  "/graphql",
  graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
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
