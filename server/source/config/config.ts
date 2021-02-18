const config = {
    saml: {
        // TODO: when build, change this reference
        cert: './source/config/saml.pem',
        // TODO: create an account here https://developer.okta.com/ with an application for entry-point
        entryPoint: '',
        issuer: 'http://localhost:8080',
        options: {
            failureRedirect: '/login',
            failureFlash: true
        }
    },
    server: {
        port: 8080
    },
    session: {
        resave: false,
        secret: 'secret',
        saveUninitialized: true
    }
}

export default config
