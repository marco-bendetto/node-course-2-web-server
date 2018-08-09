const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
//Add some middleware
app.use(express.static(__dirname + '/public')); 

//we can create a middleware that tells us how the server is working
app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if(err) {
            console.log('Unable to append to server.log');
        }
    });
    next(); //otherwise the program doesn't go ahead
});

//app.use((req, res, next) => {
//    res.render('maintenance.hbs', {
//        pageTitle: 'Maintenance page'
//    });
    //The app doesn't go ahead anymore and diplays only maintenance page
    //only help page seems not to be affected by this change
    //this is because the middlewares we're implementing follow the order and .use(express.static(..)) is above of this

//});

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

//we can register a handler for http request
//Route setup
app.get('/', (req, res) => {
    //request contains path, body, header
    //with respond you can send data back

    //res.send('<h1>Hello Express!</h1>');

    //How to send a JSON
    //res.send({
    //    name: 'Marco',
    //    likes: [
    //        'thing1',
    //        'thing2'
    //    ]
    //});

    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome to some website',
    });
});

app.get('/about', (req,res) => {
    //res.send('About page');
    res.render('about.hbs', {
        pageTitle: 'AboutPage',
    });
});

app.get('/bad', (req,res) => {
    res.send({
        errorMessage: 'Unable to handle request'
    });
});

//now we have to bind a port on the maching and make it listen
//app.listen(3000, () => {
//   console.log('Server is up on port 3000');
//});

//Last time we set a static port, but it could be dinamic and depends on where we deploy our app
//we set port to a PORT value saved in a object process.env which contains all environment varibles. If it can't find the value, it sets to 3000 so the app can work locally
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});

