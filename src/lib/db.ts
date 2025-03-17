import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MongoDB URI topilmadi. .env faylini tekshiring.');
}

let isConnected = false;

export async function connectToDatabase() {
  if (isConnected) return;

  try {
    await mongoose.connect(MONGODB_URI!);
    isConnected = true;
    console.log('MongoDB ulanish muvaffaqiyatli');
  } catch (error) {
    console.error('MongoDB ulanishda xato:', error);
    throw new Error('Database ulanishda xatolik');
  }
}
