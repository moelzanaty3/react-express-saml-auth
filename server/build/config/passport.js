"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var passport_1 = __importDefault(require("passport"));
var passport_saml_1 = require("passport-saml");
var config_1 = __importDefault(require("./config"));
var logging_1 = __importDefault(require("./logging"));
var savedUsers = [];
passport_1.default.serializeUser(function (expressUser, done) {
    logging_1.default.info(expressUser, 'Serialize User');
    done(null, expressUser);
});
passport_1.default.deserializeUser(function (expressUser, done) {
    logging_1.default.info(expressUser, 'Deserialize User');
    done(null, expressUser);
});
passport_1.default.use(new passport_saml_1.Strategy({
    issuer: config_1.default.saml.issuer,
    protocol: 'http://',
    path: '/login/callback',
    entryPoint: config_1.default.saml.entryPoint,
    cert: fs_1.default.readFileSync(config_1.default.saml.cert, 'utf-8')
}, function (expressUser, done) {
    if (!savedUsers.includes(expressUser)) {
        savedUsers.push(expressUser);
    }
    return done(null, expressUser);
}));
