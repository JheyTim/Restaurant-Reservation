const Reservation = require('../models/reservation');
const Table = require('../models/table');

/**
 * GET /api/admin/metrics/peak-hours
 * Returns #reservations per hour bucket (0‑23)
 */
exports.getPeakHours = async (_req, res, next) => {
  try {
    const data = await Reservation.aggregate([
      {
        $group: {
          _id: { $hour: '$slotStart' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.json(
      data.map(({ _id, count }) => ({ hour: _id, reservations: count }))
    );
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/metrics/table-usage
 * Returns total reservations per table
 */
exports.getTableUsage = async (_req, res, next) => {
  try {
    const data = await Reservation.aggregate([
      {
        $group: {
          _id: '$table',
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: Table.collection.name,
          localField: '_id',
          foreignField: '_id',
          as: 'table',
        },
      },
      {
        $unwind: '$table',
      },
      {
        $project: {
          _id: 0,
          tableName: '$table.name',
          reservation: '$count',
          capacity: '$table.capacity',
        },
      },
      { $sort: { reservations: -1 } },
    ]);
    res.json(data);
  } catch (err) {
    next(err);
  }
};
