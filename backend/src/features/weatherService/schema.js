import mongoose from 'mongoose';

const citySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'City name is required'],
    trim: true
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Ensure unique city per user
citySchema.index({ userId: 1, name: 1, country: 1 }, { unique: true });

// Geospatial index for location queries
citySchema.index({ location: '2dsphere' });

const cityModel = mongoose.model('City', citySchema);
export default cityModel;