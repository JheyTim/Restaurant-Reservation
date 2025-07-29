exports.baseOptions = {
  timestamps: true, // createdAt, updatedAt
  versionKey: false, // disable __v
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true },
};
