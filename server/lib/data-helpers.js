'use strict';

const { ObjectId } = require('mongodb');

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
	return {
		// Saves a tweet to `db`
		saveTweet: function(newTweet, callback) {
			db.collection('tweets').insertOne(newTweet);
			callback(null, newTweet);
		},

		getTweets: function(callback) {
			db
				.collection('tweets')
				.find()
				.toArray(callback);
		},
		//incremnt likes on a tweet
		incrementLikeTweet: function(id, callback) {
			db
				.collection('tweets')
				.update({ _id: ObjectId(id) }, { $inc: { likes: 1 } });
			callback(null, true);
		},
		//decrement likes on a tweet
		decrementLikeTweet: function(id, callback) {
			db
				.collection('tweets')
				.update({ _id: ObjectId(id) }, { $inc: { likes: -1 } });
			callback(null, true);
		},
	};
};
