import express from 'express';
import compression from 'compression';
import * as sapper from '@sapper/server';
import passport from 'passport';
import session from 'express-session';
import sessionFileStore from 'session-file-store';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import dotenv from 'dotenv';
dotenv.config({ path: `./config/${process.env.NODE_ENV}.env`});

mongoose.Promise = global.Promise;

const StravaStrategy = require('passport-strava-oauth2').Strategy;

const {PORT, NODE_ENV} = process.env;
const dev = NODE_ENV === 'development';
const FileStore = sessionFileStore(session);

const setupServer = () => {
    passport.use(new StravaStrategy({
            clientID: process.env.STRAVA_CLIENT_ID,
            clientSecret: process.env.STRAVA_CLIENT_SECRET,
            callbackURL: `${process.env.BASE_URL}/auth/strava/callback`
        },
        function (accessToken, refreshToken, profile, done) {
            process.nextTick(function () {
                return done(null, profile);
            });
        }
    ));

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (obj, done) {
        done(null, obj);
    });

    express()
        .use(passport.initialize())
        .use(bodyParser.json())
        .use(session({
            secret: 'conduit',
            resave: false,
            saveUninitialized: true,
            cookie: {
                maxAge: 31536000
            },
            store: new FileStore({
                path: `.sessions`
            })
        }))
        .get('/auth/strava',
            passport.authenticate('strava', {scope: ['read']}),
            function (req, res) {
                // The request will be redirected to Strava for authentication, so this
                // function will not be called.
            })
        .get('/auth/strava/callback',
            passport.authenticate('strava', {failureRedirect: '/login'}),
            function (req, res) {
                res.redirect('/');
            })
        .get('/auth/logout', (req, res) => {
            req.session.destroy(function (err) {
                res.clearCookie('connect.sid');
                res.redirect('/');
            });
        })
        .get('/', ensureAuthenticated, (req, res, next) => {
            next();
        })
        .use(
            compression({threshold: 0}),
            //sirv('static', {dev}),
            sapper.middleware({
                session: req => {
                    const user = req.session.passport ? req.session.passport.user : null;
                    return {user};
                }
            })
        )
        .listen(PORT, err => {
            if (err) console.log('error', err);
        });
};

const ensureAuthenticated = (req, res, next) =>{
    if (req.session.passport && req.session.passport.user) {
        return next();
    }
    res.redirect('/register')
};

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=> {
        setupServer();
    })
    .catch(error => {
        console.log("Failed to connect to mongodb: ", error);
    });




