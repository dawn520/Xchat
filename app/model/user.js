'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const UserSchema = new Schema({
    _id: {
      type: String,
    },
    username: {
      type: String,
    },
    password: {
      type: String,
    },
    avatar: {
      type: String,
    },
    created_at: {
      type: Date,
    },
    updated_at: {
      type: Date,
    },
    deleted_at: {
      type: Date,
    },
    friends: {
      type: Array,
    },
  });
  return mongoose.model('User', UserSchema, 'users');
};
