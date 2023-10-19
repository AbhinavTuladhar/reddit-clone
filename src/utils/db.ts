import mongoose from 'mongoose'

export const connectDatabase = async () => {
  try {
    const url = process.env.MONGODB_URL
    if (!url) {
      console.error('Database url not configured.')
      process.exit(200)
    }
    await mongoose.connect(url)
  } catch (error) {
    throw new Error('Unable to connect to database')
  }
}