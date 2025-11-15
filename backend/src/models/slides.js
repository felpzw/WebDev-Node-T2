const { Admin } = require('mongodb');
const mongoose = require('../config/db');
const Schema = mongoose.Schema;


const SlideSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is necessary.'],
      unique: true,
      trim: true,
    },
    duration: {
        type: Number,
        required: [true, 'Text is necessary.'],
    },
    content: {
        type: String,
        required: [true, 'Data is necessary']

    },
    expirationDate: {
        type: Date,
        required: [true, 'Exp Date is necessary']
    }
  },
  { timestamps: true }
);

const Slide = mongoose.model('Slide', SlideSchema);

module.exports = Slide;