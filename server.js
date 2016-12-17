const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;

var app = express();

app.set('view engine','hbs'); //change express to use hbs
hbs.registerPartials(__dirname+'/views/partials');
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});
hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    
    console.log(log);
    fs.appendFile('server.log',log + '\n',(err) => {
        if(err){
            console.log('Unable to append to server.log');
        }
    });
    
    next();
});

// If this section is uncommented the app is going to send only the maintenance page
// app.use((req, res, next) => {
//     res.render('maintenance.hbs'); // It will stop execution here because there isn't a next();
// });

app.use(express.static(__dirname+'/public')); //__dirname is a property of the process that runs node

app.get('/', (req, res) =>{
    //res.send('<h1>Hello Express!</h1>')
    res.render('home.hbs',{
        pageTitle: 'Home page',
        welcomeMessage: 'Welcome to this website'
    });
});

app.get('/about', (req, res) =>{
    res.render('about.hbs',{
        pageTitle: 'About page'
    });
});

app.get('/bad', (req, res) =>{
    res.send({
        errorMessage:'Error handling'
    });
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
});