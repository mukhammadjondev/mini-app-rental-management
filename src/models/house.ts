import { Schema, models, model } from 'mongoose';

const HouseSchema = new Schema(
  {
    address: {
      type: String,
      required: true,
    },
    totalRooms: {
      type: Number,
      required: true,
      min: 1,
    },
    monthlyBaseRent: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'maintenance'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

const House = models.House || model('House', HouseSchema);
export default House;
