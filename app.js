const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const Event = require("./models/event");
const User = require("./models/user");
const bcrypt = require("bcryptjs");
const schemaBuilder = require("./schemas/schema");

const app = express();

app.use(bodyParser.json());

app.use(
  "/graphql",
  graphqlHttp({
    schema: buildSchema(schemaBuilder),
    rootValue: {
      events: () => {
        return Event.find({})
          .then(events => {
            return events.map(event => {
              return { ...event._doc };
            });
          })
          .catch(err => {
            console.log(err);
          });
      },
      createEvent: args => {
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date),
          creator: "5cec11fb9c8c030840f5bcb8"
        });
        let createdEvent;
        return event
          .save()
          .then(result => {
            createdEvent = { ...result._doc }
            return User.findById("5cec11fb9c8c030840f5bcb8");
          })
          .then(user => {
            if (!user) {
              throw new Error("User not found.");
            }
            console.log(user);
            user.createdEvents.push(event);
            return user.save();
          })
          .then(result => {
            return createdEvent;
          })
          .catch(err => {
            console.log(err);
            throw err;
          });
      },
      createUser: args => {
        return User.findOne({ email: args.userInput.email }).then(user => {
          if (user) {
            throw new Error("User exists already.");
          }
          return bcrypt
            .hash(args.userInput.password, 12)
            .then(hashPassword => {
              const user = new User({
                email: args.userInput.email,
                password: hashPassword
              });
              return user.save();
            })
            .then(result => {
              return { ...result._doc, password: null };
            })
            .catch(err => {
              console.log(err);
              throw err;
            });
        });
      }
    },
    graphiql: true
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${
      process.env.MONGO_PASSWORD
    }@graphqlcluster-3axar.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`
  )
  .then(() => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
