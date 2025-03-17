import { Schema, models, model } from 'mongoose';

const PaymentSchema = new Schema(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: 'Tenant',
      required: true,
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
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentType: {
      type: String,
      enum: ['rent', 'deposit', 'fine', 'other'],
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'transfer', 'card', 'other'],
      default: 'cash',
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
    },
    period: {
      month: {
        type: Number, // 1-12
        min: 1,
        max: 12,
      },
      year: {
        type: Number,
      },
    },
    status: {
      type: String,
      enum: ['paid', 'pending', 'late', 'partial'],
      default: 'paid',
    },
    notes: {
      type: String,
      default: '',
    },
    receiptNumber: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = models.Payment || model('Payment', PaymentSchema);
export default Payment;
