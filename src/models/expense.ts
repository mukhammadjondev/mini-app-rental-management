import { Schema, models, model } from 'mongoose';

const ExpenseSchema = new Schema(
  {
    houseId: {
      type: Schema.Types.ObjectId,
      ref: 'House',
      required: true,
    },
    roomId: {
      type: Schema.Types.ObjectId,
      ref: 'Room',
    },
    expenseType: {
      type: String,
      enum: [
        'electricity',
        'water',
        'gas',
        'repair',
        'maintenance',
        'tax',
        'cleaning',
        'security',
        'other',
      ],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'transfer', 'card', 'other'],
      default: 'cash',
    },
    expenseDate: {
      type: Date,
      default: Date.now,
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
    paidBy: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      default: '',
    },
    receiptNumber: {
      type: String,
    },
    images: [String],
  },
  {
    timestamps: true,
  }
);

const Expense = models.Expense || model('Expense', ExpenseSchema);
export default Expense;
