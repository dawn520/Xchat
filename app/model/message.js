'use strict';
const mongooseDateFormat = require('mongoose-date-format');
const mongooseCreatedAtUpdatedAt = require('mongoose-createdat-updatedat');

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const MessageSchema = new Schema({
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
    read_at: {
      type: Date,
      default: null,
    },
    // created_at: {
    //   type: Date,
    //   default: Date.now,
    // },
    // updated_at: {
    //   type: Date,
    //   default: Date.now,
    // },
    deleted_at: {
      type: Date,
      default: null,
    },
  });
  const options = {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
  MessageSchema.plugin(mongooseDateFormat);
  MessageSchema.plugin(mongooseCreatedAtUpdatedAt, options);
  return mongoose.model('Message', MessageSchema, 'messages');
};
