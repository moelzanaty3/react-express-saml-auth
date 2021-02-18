import http from 'http'
import express from 'express'
import session from 'express-session'
import passport from 'passport'
import  cors from 'cors'
import logging from './config/logging'
import config from './config/config'
import './config/passport'

const app = express()

/** Log the request */
app.use((req, res, next) => {
    logging.info(`METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`)

    res.on('finish', () => {
        logging.info(
            `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`
        )
    })

    next()
})

/** Parse the body of the request / Passport */
app.use(session(config.session))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.urlencoded({ extended: false })) // Replaces Body Parser
app.use(express.json()) // Replaces Body Parser

/** Rules of our API */
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.header('origin'));
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }

    next();
});

/** Passport & SAML Routes */
app.get('/login', passport.authenticate('saml', config.saml.options), (req, res, next) => {
    return res.redirect('http://localhost:3000')
})

app.post('/login/callback', passport.authenticate('saml', config.saml.options), (req, res, next) => {
    return res.redirect('http://localhost:3000')
})


app.get('/whoami', (req, res, next) => {
    logging.info(req, 'whoami')
    if (!req.isAuthenticated()) {
        logging.info('User not authenticated')

        return res.status(401).json({
            message: 'Unauthorized'
        })
    } else {
        logging.info('User authenticated')
        logging.info(req.user)

        return res.status(200).json({ user: req.user })
    }
})

/** Health Check */
app.get('/health-check', (req, res, next) => {
    return res.status(200).json({ message: 'Server is running!', status: 'success' })
})

/** Error handling */
app.use((req, res, next) => {
    const error = new Error('Not found')

    res.status(404).json({
        message: error.message,
        status: 'failure'
    })
})

/** Server Handling */
app.listen(config.server.port, () => {
    logging.info(`Server is running on port ${config.server.port}`)
})
