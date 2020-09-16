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
import owasp from 'owasp-password-strength-test';
import jwt from 'jsonwebtoken';

import config from '../webpack.config.dev.js';
import dbUtils from './db';
import searchUtils from './search';

const port = 8000;
const app = express();
const compiler = webpack(config);

owasp.config({
    allowPassphrases: true,
    minLength: 8
});

dotenv.config();
app.use(compression());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser({ extended: true }));
app.use(cors());
app.use(express.static(`${__dirname }/public`));
app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));

const illegalCharsFormat = /[!@#$%^&*()+\-=[\]{};':"\\|,.<>/?]/;

const logRequest = req => (
    `REQUEST from ${
        req.ip
    } FORWARDED from ${
        req.ips.toString()
    } BODY ${
        req.body}`
);

app.get('/*', (req, res) => {
    console.log(chalk.gray(`INFO: ${ logRequest(req)}`));
    res.sendFile(path.join(__dirname, '../src/index.html'));
});

/* Authenticates the user. */
app.post('/api/authenticate', (req, res) => {
    console.log(chalk.gray(`INFO: ${ logRequest(req)}`));
    res.writeHead(200, { 'Content-Type': 'application/json' });
    const { username, password } = req.body;

    // Check for empty strings.
    if (!username || !password) {
        console.log(chalk.yellow(`WARN: Empty fields${ req}`));
        res.end(JSON.stringify({
            success: false,
            message: 'Fields cannot be empty'
        }));
    }
    else {
        dbUtils.authenticate(username, password, (err, authResult) => {
            if (err) {
                console.log(chalk.red(`ERROR: ${err.message}`));
                res.end(JSON.stringify({ success: false }));
                return;
            }

            if (authResult.success) {
                const user = {
                    username: authResult.results.username,
                    name: authResult.results.name,
                    dp: authResult.results.dp
                };

                const token = jwt.sign(user, process.env.SESSION_SECRET, { expiresIn: '1 day' });

                console.log(chalk.green('INFO: Successful request'));
                res.end(JSON.stringify({
                    success: true,
                    message: 'Logged in successfully!',
                    user,
                    token
                }));
            }
            else {
                console.log(chalk.yellow('WARN: Authentication failed.'));
                res.end(JSON.stringify({
                    success: false,
                    message: authResult.message
                }));
            }
        });
    }
});

app.post('/api/register', (req, res) => {
    console.log(chalk.gray(`INFO: ${logRequest(req)}`));
    res.writeHead(200, { 'Content-Type': 'application/json' });

    const { username, password, name } = req.body;

    // Check empty strings or null
    if (!username || !password || !name) {
        console.log(chalk.yellow('WARN: Empty fields in body.'));
        res.end(JSON.stringify({
            success: false,
            message: 'Empty input'
        }));
        return;
    }

    // Test for illegal characters
    if (illegalCharsFormat.test(username) ||
        illegalCharsFormat.test(name)) {
        console.log(chalk.yellow('WARN: Username or name contains invalid bytes.'));
        res.end(JSON.stringify({
            success: false,
            message: 'Invalid characters in input'
        }));
        return;
    }

    // Check spaces in username
    if (username.includes(' ')) {
        console.log(chalk.yellow('WARN: Username contains spaces'));
        res.end(JSON.stringify({
            success: false,
            message: 'Username includes spaces'
        }));
        return;
    }

    // Check that the password is secure.
    if (!owasp.test(password).strong) {
        console.log(chalk.yellow('WARN: Password not secure.'));
        res.end(JSON.stringify({ success: false }));
        return;
    }

    dbUtils.register(username, password, name, (err, result) => {
        if (err) {
            console.log(chalk.red(`ERROR: Database registration failed: ${err.message}`));
            res.end(JSON.stringify(result));
            return;
        }

        if (result.success) {
            const user = {
                username,
                password,
                name,
                dp: null
            };
            const token = jwt.sign(user, process.env.SESSION_SECRET, { expiresIn: '1 day' });

            console.log(chalk.green('INFO: Request successful.'));

            res.end(JSON.stringify({
                ...result,
                token
            }));
        }
        else {
            console.log(chalk.yellow(`WARN: Database registration failed: ${err.message}`));
            res.end(JSON.stringify(result));
        }
    });
});

app.put('/api/authenticate', async(req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    console.log(chalk.info(`INFO: ${logRequest(req)}`));

    const { token, password } = req.body;

    // Check that the password is secure.
    if (!owasp.test(password).strong) {
        console.log(chalk.yellow('WARN: Password not secure.'));
        res.end(JSON.stringify({ success: false }));
        return;
    }

    // Verify token
    if (token) {
        jwt.verify(token, process.env.SESSION_SECRET, async(err, decoded) => {
            if (err) {
                console.log(chalk.yellow('WARN: JWT verification failed.'));
                res.end(JSON.stringify({ success: false }));
                return;
            }

            const { username } = decoded;
            const result = await dbUtils.updatePassword(username, password);

            if (result) {
                console.log(chalk.green('INFO: Request successful.'));
                res.end(JSON.stringify({ success: true }));
                return;
            }
            else {
                console.log(chalk.yellow('WARN: Failed to update password.'));
                res.end(JSON.stringify({ success: false }));
                return;
            }
        });
    }
    else {
        console.log(chalk.yellow('WARN: Empty token passed.'));
        res.end(JSON.stringify({ success: false }));
        return;
    }
});

app.post('/api/search', async(req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    console.log(chalk.info(`INFO: ${logRequest(req)}`));

    const { token, query } = req.body;

    // Verify token
    if (token) {
        jwt.verify(token, process.env.SESSION_SECRET, async(err, decoded) => {
            if (err) {
                console.log(chalk.yellow('WARN: JWT verification failed.'));
                res.end(JSON.stringify({
                    success: false,
                    message: 'Invalid token'
                }));
                return;
            }

            const { username } = decoded;

            const searchResults = searchUtils.search('social.io', 'users', query);

            if (!searchResults) {
                console.log(chalk.yellow('WARN: Search failed.'));
                res.end(JSON.stringify({ success: false }));
                return;
            }

            const queryDocs = searchResults.hits.hits;
            const nonPrivateUsers = await queryDocs.filter(async doc => {
                const privacyMode = await dbUtils.getPrivacyMode(doc.username);

                if (!privacyMode) {
                    console.log(chalk.yellow('WARN: Failed to fetch privacy mode.'));
                    res.end(JSON.stringify({ success: false }));
                    return;
                }

                if (privacyMode === 'private') return false;
                if (privacyMode === 'public') return true;

                // Protected.
                return dbUtils.areFriends(username, query);
            });

            console.log(chalk.green('INFO: Request successful.'));
            res.end(JSON.stringify({
                success: true,
                results: nonPrivateUsers
            }));
            return;
        });
    }
    else {
        console.log(chalk.yellow('WARN: Empty token passed.'));
        res.end(JSON.stringify({ success: false }));
        return;
    }
});

app.post('/api/user/privacy', async(req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    console.log(chalk.info(`INFO: ${logRequest(req)}`));

    const { token, to } = req.body;

    // Verify token
    if (token) {
        jwt.verify(token, process.env.SESSION_SECRET, async(err, decoded) => {
            if (err) {
                console.log(chalk.yellow('WARN: JWT verification failed.'));
                res.end(JSON.stringify({
                    success: false,
                    message: 'Invalid token'
                }));
                return;
            }

            const { username } = decoded;
            const result = await dbUtils.updatePrivacyPreferences(username, to);

            if (result) {
                console.log(chalk.green('INFO: Request successful.'));
                res.end(JSON.stringify({ success: true }));
                return;
            }
            else {
                console.log(chalk.yellow('WARN: Failed to update preferences.'));
                res.end(JSON.stringify({ success: false }));
                return;
            }
        });
    }
    else {
        console.log(console.warn('WARN: Empty token.'));
        res.end(JSON.stringify({ success: false }));
        return;
    }
});

app.post('/api/feed', async(req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    console.log(chalk.gray(`INFO: ${logRequest(req)}`));

    const { token } = req.body;
    console.log(token);
    // Verify token
    if (token) {
        jwt.verify(token, process.env.SESSION_SECRET, async(err, decoded) => {
            if (err) {
                console.log(chalk.yellow('WARN: JWT verification failed.'));
                res.end(JSON.stringify({
                    success: false,
                    message: 'Invalid token'
                }));
                return;
            }

            const { username } = decoded;
            dbUtils.getFriendPosts(username, (e, posts) => {
                if (e) {
                    console.log(chalk.red(`ERROR: Failed to get friend posts: ${e.message}`));
                    res.end(JSON.stringify(e));
                    return;
                }

                console.log(chalk.green('INFO: Successful request'));
                res.end(JSON.stringify({
                    success: true,
                    ...posts
                }));
            });
        });
    }
    else {
        console.log(chalk.yellow('WARN: Empty token'));
        res.end(JSON.stringify({ success: false }));
    }
});

app.listen(port, err => {
    if (err) throw err;
    open(`http://localhost:${ port}`);
    console.log(chalk.green(`Server is running at port ${ port}`));
});
