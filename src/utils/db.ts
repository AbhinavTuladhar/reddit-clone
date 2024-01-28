import mongoose from 'mongoose'

export const connectDatabase = async () => {
  try {
    const url = process.env.MONGODB_URI
    if (!url) {
      console.error('Database url not configured.')
      process.exit(200)
    }
    await mongoose.connect(url)
  } catch (error) {
    console.error(error)
    throw error
  }
}
