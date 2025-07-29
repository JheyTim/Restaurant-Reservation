const mongoose = require('mongoose');
const { baseOptions } = require('./_baseOption');

const ReservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Table',
      required: true,
    },
    slotStart: {
      type: Date,
      required: true,
      validate: {
        validator: (v) => v.getMinutes() % 30 === 0, // optional alignment rule
        message: 'Slots must start on the haft-hour mark',
      },
    },
    slotEnd: {
      type: Date,
      required: true,
    },
    guests: {
      type: Number,
      required: true,
      min: 1, // capacity check happens in service layer because we need table.capacity
    },
  },
  baseOptions
);

/**
 * Index prevents duplicate *exact* time ranges for same table.
 * Mongo will throw 11000, which our error handler converts to 409.
 */

ReservationSchema.index(
  { table: 1, slotStart: 1, slotEnd: 1 },
  { unique: true }
);

/* Convenience virtual so APIs can return “duration” */
ReservationSchema.virtual('durationMins').get(function () {
  return (this.slotEnd - this.slotStart) / (60 * 1000);
});

module.exports = mongoose.model('Reservation', ReservationSchema);
