const Message = require("../models/message");

const findAllMessages = async () => {
  return Message.find({});
};

const createMessage = async (data) => {
  return Message.create(data);
};

module.exports = { findAllMessages, createMessage };
