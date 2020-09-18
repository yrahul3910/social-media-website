import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import chalk from 'chalk';
import searchUtils from './search';

dotenv.config();

const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const hostname = process.env.DB_URL;
const uri = `mongodb+srv://${user}:${password}@${hostname}/db?retryWrites=true&w=majority`;

/**
 * Checks if the user has entered the right set of authentication details.
 * @param {string} username - The username entered
 * @param {string} pwd - The plaintext password entered
 * @param {Function} func - The callback function
 */
exports.authenticate = (username, pwd, callback) => {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        if (err) throw err;

        const collection = client.db('db').collection('users');
        collection.findOne({ username }, (findErr, results) => {
            if (findErr) {
                callback({
                    success: false,
                    message: 'Find failed.'
                });
                return;
            }

            // If empty results, error.
            if (!results) {
                callback(null, {
                    success: false,
                    message: 'Invalid username'
                });
                return;
            }

            // Check password
            bcrypt.compare(pwd, results.password, (e, res) => {
                if (e || !res) {
                    callback({
                        success: false,
                        message: 'Comparison failed'
                    });
                    return;
                }

                callback(null, {
                    success: true,
                    results
                });
            });
        });

        client.close();
    });
};

/**
 * Registers a user by adding the details to the users table. Also adds user to
 * subscriptions table, since by default, every user subscribes to him/herself.
 * @param {string} username - The username of the new user
 * @param {string} pwd - The plaintext password of a user. This will be hashed.
 * @param {string} name - The user's name
 * @param {Function} func - The callback function
 */
exports.register = (username, pwd, name, callback) => {
    console.log(uri);
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        if (err) throw err;

        const collection = client.db('db').collection('users');
        collection.findOne({ username }, (e, results) => {
            if (e) {
                callback({
                    success: false,
                    message: 'Could not find user.'
                });
                return;
            }

            // If username exists, error
            if (results) {
                callback({
                    success: false,
                    message: 'Username exists.'
                });
                return;
            }

            // Hash the password
            bcrypt.hash(pwd, 10, (hashErr, hash) => {
                if (hashErr) {
                    callback({
                        success: false,
                        message: 'Failed to hash password.'
                    });
                    return;
                }

                // Insert into the database
                collection.insertOne({
                    username,
                    password: hash,
                    dp: null,
                    privacy: 'private',
                    profileImage: null,
                    name
                }, e_ => {
                    if (e_) {
                        callback({
                            success: false,
                            message: 'Failed to insert'
                        });
                        return;
                    }

                    callback(null, { success: true });
                });
            });
        });
    });
    client.close();
};

exports.uploadProfileImage = async(username, profileImage) => {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    const result = await client.connect(async err => {
        if (err) throw err;

        const collection = client.db('db').collection('users');

        const result = await collection.findOneAndUpdate({ username },
            { profileImage });

        return result;
    });

    return result;
};

/**
 * Gets all posts by a user.
 * @param {string} username - The username.
 */
exports.getPostsByUser = async username => {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    await client.connect();
    const collection = client.db('db').collection('posts');
    const posts = collection.find({ username });

    if (!posts) return null;

    const result = await posts.toArray();
    return result;
};

/**
 * Gets all the posts by the user's friends and the user himself.
 * @param {string} username - Username decoded from token
 * @param {Function} callback - A callback function.
 */
exports.getFriendPosts = async(username, callback) => {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        if (err) throw err;

        const collection = client.db('db').collection('friends');
        collection.find({ $or: [{ user1: username }, { user2: username }]}, async(e, friends) => {
            if (e) {
                callback({
                    success: false,
                    message: 'Could not locate friends'
                });
                return;
            }

            const f = await friends.toArray();
            const post_coll = client.db('db').collection('posts');
            post_coll.find({
                username: {
                    $in: f.map(x => x.user1).concat(
                        f.map(x => x.user2))
                }
            }, { _id: 0 }, async(postErr, posts) => {
                if (postErr) {
                    callback({
                        success: false,
                        message: 'Could not find posts'
                    });
                    return;
                }

                const postsArr = await posts.toArray();
                callback(null, postsArr);
            });
        });
    });
};

/**
 * Updates the user's privacy preferences.
 * @param {string} username - Username.
 * @param {string} to - Privacy setting to change to.
 */
exports.updatePrivacyPreferences = async(username, to) => {
    if (to !== 'private' && to !== 'public' && to !== 'protected') {
        console.log(chalk.warn(`ERROR: Invalid privacy value passed: ${to}`));
        return false;
    }

    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(async err => {
        if (err) throw err;

        const collection = client.db('db').collection('users');
        await collection.findOneAndUpdate({ username },
            { $set: { privacy: to } },
            { returnNewDocument: false });

        if (to !== 'private') {await searchUtils.index('social.io', 'users', { username });}
        else {await searchUtils.deleteDoc('social.io', 'users', username);}

        return { success: true };
    });
};

/**
 * Updates a user's password.
 * @param {string} username - The username.
 * @param {string} pwd - Plain-text password.
 */
exports.updatePassword = async(username, pwd) => {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(async err => {
        if (err) throw err;

        const collection = client.db('db').collection('users');

        const hash = await bcrypt.hash(pwd, 10);

        if (!hash) return false;

        const result = await collection.findOneAndUpdate({ username },
            { $set: { password: hash } });

        return result;
    });
};

/**
 * Checks whether two users are friends.
 * @param {string} user1 - Username of first user
 * @param {string} user2 - Username of second user
 */
exports.areFriends = async(user1, user2) => {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        if (err) throw err;

        const collection = client.db('db').collection('friends');
        collection.find({
            user1,
            user2
        }, async(e, friends) => {
            if (e) {return false;}

            const f = await friends.toArray();
            return f.length > 0;
        });
    });
};

/**
 * Gets the privacy mode of the user.
 * @param {string} username - Username.
 */
exports.getPrivacyMode = async username => {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    await client.connect();
    const collection = client.db('db').collection('users');

    const result = await collection.findOne({ username },
        {
            username: 0,
            name: 0,
            _id: 0,
            dp: 0,
            privacy: 1
        });

    return result;
};

/**
 * Deletes a user from the database.
 * @param {string} username - The username of the user to delete.
 */
exports.deleteUser = async username => {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(async err => {
        if (err) throw err;

        const collection = client.db('db').collection('users');
        const result = await collection.deleteOne({ username });

        return { success: result.acknowledged };
    });
};

/**
 * Fetches user details.
 * @param {string} username - The username
 */
exports.getUserDetails = async username => {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    await client.connect();
    const collection = client.db('db').collection('users');
    const result = await collection.findOne({ username }, {
        projection: {
            _id: 0,
            username: 1,
            name: 1,
            privacy: 1
        }
    });

    return result;
};

module.exports = exports;
