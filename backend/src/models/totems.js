const { Admin } = require('mongodb');
const mongoose = require('../config/db');
const Schema = mongoose.Schema;


const TotemSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is necessary.'],
      trim: true,
    },
    authToken: {
        type: String,
        required: [true, 'Auth Token is necessary.'],
        trim: true
    },
    lastSeen: {
        type: Date,
        required: [true, 'LastSeen is necessary']

    }
  },
  { timestamps: true }
);

const totem = mongoose.model('Totem', TotemSchema);

module.exports = totem;