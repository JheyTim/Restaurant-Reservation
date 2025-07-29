const mongoose = require('mongoose');
const { baseOptions } = require('./_baseOption');

/**
 * Physical table in the dining area.
 * Use a human‑readable `name` instead of a numeric ID so staff
 * can recognise it quickly (e.g., „T‑01“, „Window‑2“).
 */

const TableSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    locationNote: String, // „near window“, „VIP room“, …
  },
  baseOptions
);

module.exports = mongoose.model('Table', TableSchema);
