'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const UserSchema = new Schema({
    message: {
      type: String,
    },
    message_type: {
      type: Number,
    },
    sender: {
      type: String,
    },
    receiver: {
      type: Schema.Types.ObjectId, ref: 'User',
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    read_at: {
      type: Date,
      default: null,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  });
  return mongoose.model('Message', UserSchema, 'messages');
};
