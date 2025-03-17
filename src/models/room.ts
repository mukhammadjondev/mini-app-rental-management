import { Schema, models, model } from 'mongoose';

const RoomSchema = new Schema(
  {
    houseId: {
      type: Schema.Types.ObjectId,
      ref: 'House',
      required: true,
    },
    roomNumber: {
      type: String,
      required: true,
    },
    monthlyRent: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['vacant', 'occupied', 'reserved', 'maintenance'],
      default: 'vacant',
    },
    amenities: [String],
    currentTenants: {
      type: [Schema.Types.ObjectId],
      ref: 'Tenant',
      default: null,
    },
    maxTenants: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

const Room = models.Room || model('Room', RoomSchema);
export default Room;
