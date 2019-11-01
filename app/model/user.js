'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const UserSchema = new Schema({
    username: {
      type: String,
    },
    password: {
      type: String,
    },
    avatar: {
      type: String,
    },
    online: {
      type: Number,
    },
    socket_id: {
      type: Array,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
    deleted_at: {
      type: Date,
    },
    friends: [{
      type: Schema.Types.ObjectId, ref: 'User',
    }],
  });
  return mongoose.model('User', UserSchema, 'users');
};
