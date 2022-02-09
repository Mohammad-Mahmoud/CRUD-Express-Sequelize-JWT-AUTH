const express = require('express')
const bodyParser = require('body-parser')
const db = require("./models");
const passport = require('passport')

const app = express()
const PORT = 8080

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());


require('./routes/api-routes')(app)



db.sequelize.sync().then(function() {
    app.listen(PORT, function() {
        console.log("Listening on %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
    });
});
