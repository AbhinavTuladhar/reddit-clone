import mongoose from 'mongoose'

export const connectDatabase = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/reddit')
  } catch (error) {
    throw new Error('Unable to connect to database')
  }
}