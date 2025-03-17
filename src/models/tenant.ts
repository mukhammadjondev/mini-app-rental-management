import { Schema, models, model } from 'mongoose';

const TenantSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    identificationDocument: {
      type: String,
      default: '',
    },
    rentStartDate: {
      type: Date,
      required: true,
    },
    rentEndDate: {
      type: Date,
    },
    monthlyRent: {
      type: Number,
      required: true,
    },
    securityDeposit: {
      type: Number,
      default: 0,
    },
    balance: {
      type: Number,
      default: 0,
    },
    roomId: {
      type: Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    houseId: {
      type: Schema.Types.ObjectId,
      ref: 'House',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'pending', 'former'],
      default: 'active',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Tenant = models.Tenant || model('Tenant', TenantSchema);
export default Tenant;
