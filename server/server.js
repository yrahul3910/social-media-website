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
// Import searchUtils from './search';

const port = 8000;
const app = express();
const compiler = webpack(config);

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
                res.end();
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

            /*
             * Index to search
             *searchUtils.index('social.io', 'user', {name, username});
             */

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

app.post('/api/feed', async(req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    console.log(chalk.info(`INFO: ${logRequest(req)}`));

    const { token } = req.body;

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
                res.end(JSON.stringify(posts));
            });
        });
    }
    else {
        console.log(chalk.yellow('WARN: Empty token'));
        res.end();
    }
});

app.listen(port, err => {
    if (err) throw err;
    open(`http://localhost:${ port}`);
    console.log(chalk.green(`Server is running at port ${ port}`));
});
