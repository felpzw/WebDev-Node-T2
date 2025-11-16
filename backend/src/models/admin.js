const mongoose = require('../config/db');
const Schema = mongoose.Schema;


const AdminSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is necessary.'],
      unique: true,
      trim: true,
    },
    password: {
        type: String,
        required: [true, 'Password is necessary.'],
    }/*,
    name: {
        type: String,
        required: [true, 'Name is necessary']

    }*/,
    nonce: {
        type: Number,

    }
  },
  { timestamps: true }
);

const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;