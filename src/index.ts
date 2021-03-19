import { Expression } from "../node_modules/typescript/lib/typescript";
const path = require('path');
const http = require('http');
import express from "express";
// const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

alert("about to handle get requests"); 

// Handle GET requests
app.get("/" || "/index" || "/index.html" ,(req:express.Request, res:express.Response) => {
    res.sendFile(path.join(__dirname, 'public', 'index2.html')); 
}); 



app.get('/404', function(req, res, next){
// trigger a 404 since no other middleware
// will match /404 after this one, and we're not
// responding here
next();
});

app.get('/403', function(req, res, next){
// trigger a 403 error
var err : any = new Error('not allowed!');
err.status = 403;
next(err);
});

app.get('/500', function(req, res, next){
// trigger a generic (500) error
next(new Error('keyboard cat!'));
});

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
    res.status(404); 
    res.send('what???');
});

app.get('/public/*', function(req, res){
    res.status(404); 
    res.send('what???');
});


// Error handlers

// Since this is the last non-error-handling
// middleware use()d, we assume 404, as nothing else
// responded.

// $ curl http://localhost:3000/notfound
// $ curl http://localhost:3000/notfound -H "Accept: application/json"
// $ curl http://localhost:3000/notfound -H "Accept: text/plain"

app.use(function(req, res, next){
    res.status(404);
    
    res.format({
        html: function () {
        res.render('404', { url: req.url })
        },
        json: function () {
        res.json({ error: 'Not found' })
        },
        default: function () {
        res.type('txt').send('Not found')
        }
    })
});

    // error-handling middleware, take the same form
    // as regular middleware, however they require an
    // arity of 4, aka the signature (err, req, res, next).
    // when connect has an error, it will invoke ONLY error-handling
    // middleware.

    // If we were to next() here any remaining non-error-handling
    // middleware would then be executed, or if we next(err) to
    // continue passing the error, only error-handling middleware
    // would remain being executed, however here
    // we simply respond with an error page.

app.use(function(err : any, req : express.Request, res : express.Response, next : express.NextFunction){
    // we may use properties of the error object
    // here and next(err) appropriately, or if
    // we possibly recovered from the error, simply next().
    res.status(err.status || 500);
    res.render('500', { error: err });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
