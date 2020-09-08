import express from 'express';
import path from 'path';
import open from 'open';
import compression from 'compression';
import dotenv from 'dotenv';
import chalk from 'chalk';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import webpack from 'webpack';
import jwt from 'jsonwebtoken';
import config from '../webpack.config.dev.js';
import dbUtils from './db';
//import searchUtils from './search';

const port = 8000;
const app = express();
const compiler = webpack(config);

dotenv.config();
app.use(compression());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser({extended: true}));
app.use(cors());
app.use(express.static(__dirname + '/public'));
app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));

const illegalCharsFormat = /[!@#$%^&*()+\-=[\]{};':"\\|,.<>/?]/;

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../src/index.html'));
});

/* Authenticates the user. */
app.post('/api/authenticate', (req, res) => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    let {username, password} = req.body;

    // Check for empty strings.
    if (!username || !password)
        res.end(JSON.stringify({
            success: false,
            message: 'Fields cannot be empty'
        }));
    else {
        dbUtils.authenticate(username, password, (err, authResult) => {
            if (err) throw err;

            if (authResult.success) {
                let user = {
                    username: authResult.results.username,
                    name: authResult.results.name,
                    dp: authResult.results.dp
                };

                let token = jwt.sign(user, process.env.SESSION_SECRET, {
                    expiresIn: '1 day'
                });

                res.end(JSON.stringify({
                    success: true,
                    message: 'Logged in successfully!',
                    user,
                    token
                }));
            } else
                res.end(JSON.stringify({
                    success: false,
                    message: authResult.message
                }));
        });
    }
});

app.post('/api/register', (req, res) => {
    res.writeHead(200, {'Content-Type': 'application/json'});

    let {username, password, name} = req.body;

    // Check empty strings or null
    if (!username || !password || !name) {
        res.end(JSON.stringify({
            success: false,
            message: 'Empty input'
        }));
        return;
    }

    // Test for illegal characters
    if (illegalCharsFormat.test(username) ||
        illegalCharsFormat.test(name)) {
        res.end(JSON.stringify({
            success: false,
            message: 'Invalid characters in input'
        }));
        return;
    }

    // Check spaces in username
    if (username.includes(' ')) {
        res.end(JSON.stringify({
            success: false,
            message: 'Username includes spaces'
        }));
        return;
    }

    dbUtils.register(username, password, name, (err, result) => {
        if (err) {
            res.end(JSON.stringify(result));
            return;
        }

        if (result.success) {
            let user = {username, password, name, dp: null};
            let token = jwt.sign(user, process.env.SECRET, {
                expiresIn: '1 day'
            });

            // Index to search
            searchUtils.index('social.io', 'user', {name, username});

            res.end(JSON.stringify({...result, token}));
        } else
            res.end(JSON.stringify(result));
    });
});

app.listen(port, err => {
    if (err) throw err;
    open('http://localhost:' + port);
    chalk.green('Server is running at port ' + port);
});
