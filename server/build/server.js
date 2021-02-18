"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = __importDefault(require("http"));
var express_1 = __importDefault(require("express"));
var express_session_1 = __importDefault(require("express-session"));
var passport_1 = __importDefault(require("passport"));
var logging_1 = __importDefault(require("./config/logging"));
var config_1 = __importDefault(require("./config/config"));
require("./config/passport");
var router = express_1.default();
/** Server Handling */
var httpServer = http_1.default.createServer(router);
/** Log the request */
router.use(function (req, res, next) {
    logging_1.default.info("METHOD: [" + req.method + "] - URL: [" + req.url + "] - IP: [" + req.socket.remoteAddress + "]");
    res.on('finish', function () {
        logging_1.default.info("METHOD: [" + req.method + "] - URL: [" + req.url + "] - STATUS: [" + res.statusCode + "] - IP: [" + req.socket.remoteAddress + "]");
    });
    next();
});
/** Parse the body of the request / Passport */
router.use(express_session_1.default(config_1.default.session));
router.use(passport_1.default.initialize());
router.use(passport_1.default.session());
router.use(express_1.default.urlencoded({ extended: false })); // Replaces Body Parser
router.use(express_1.default.json()); // Replaces Body Parser
/** Rules of our API */
router.use(function (req, res, next) {
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
router.get('/login', passport_1.default.authenticate('saml', config_1.default.saml.options), function (req, res, next) {
    return res.redirect('http://localhost:3000');
});
router.post('/login/callback', passport_1.default.authenticate('saml', config_1.default.saml.options), function (req, res, next) {
    return res.redirect('http://localhost:3000');
});
router.get('/whoami', function (req, res, next) {
    if (!req.isAuthenticated()) {
        logging_1.default.info('User not authenticated');
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }
    else {
        logging_1.default.info('User authenticated');
        logging_1.default.info(req.user);
        return res.status(200).json({ user: req.user });
    }
});
/** Health Check */
router.get('/healthcheck', function (req, res, next) {
    return res.status(200).json({ messgae: 'Server is running!' });
});
/** Error handling */
router.use(function (req, res, next) {
    var error = new Error('Not found');
    res.status(404).json({
        message: error.message
    });
});
httpServer.listen(config_1.default.server.port, function () { return logging_1.default.info("Server is running on port " + config_1.default.server.port); });
