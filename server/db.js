import {MongoClient} from 'mongodb';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

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
exports.authenticate = (username, password, callback) => {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        if (err) throw err;

        const collection = client.db('db').collection('users');
        collection.findOne({username}, (err, results) => {
            if (err) {
                callback({success: false, message: 'Find failed.'});
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
            bcrypt.compare(password, results.password, (e, res) => {
                if (e || !res) {
                    callback({success: false, message: 'Comparison failed'});
                    return;
                }
                
                callback({success: true, results});
            });
        });

        client.close();
    });
};

/**
 * Registers a user by adding the details to the users table. Also adds user to
 * subscriptions table, since by default, every user subscribes to him/herself.
 * @param {string} username - The username of the new user
 * @param {string} pwd - The plaintext password of the user. This will be hashed.
 * @param {string} name - The user's name
 * @param {Function} func - The callback function
 */
exports.register = (username, password, name, callback) => {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        if (err) throw err;

        const collection = client.db('db').collection('users');
        collection.findOne({username}, (err, results) => {
            if (err) {
                callback({success: false, message: 'Could not find user.'});
                return;
            }

            // If username exists, error
            if (results) {
                callback({success: false, message: 'Username exists.'});
                return;
            }

            // Hash the password
            bcrypt.hash(password, 10, (e, hash) => {
                if (e) {
                    callback({success: false, message: 'Failed to hash password.'});
                    return;
                }

                // Insert into the database
                collection.insertOne({username, password: hash, name}, e_ => {
                    if (e_) {
                        callback({success: false, message: 'Failed to insert'});
                        return;
                    }

                    callback(null, {success: true});
                });
            });
        });
    });
    client.close();
};

module.exports = exports;
