import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { connectDatabase } from '@/utils/db'
import User from '@/models/User'
import bcrypt from 'bcryptjs'

const googleClientId = process.env.GOOGLE_CLIENT_ID
const googleSecretId = process.env.GOOGLE_CLIENT_SECRET

if (!googleClientId || !googleSecretId) {
  throw new Error('Google client and secret ids are not provided.')
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleSecretId,
    }),
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',

      authorize: async (credentials) => {
        await connectDatabase()
        try {
          const user = await User.findOne({ name: credentials?.name })
          const providedPassword = credentials?.password
          if (user && providedPassword) {
            // Checking the password
            const passwordCheck = await bcrypt.compare(credentials.password, user.password)

            if (passwordCheck) {
              return user
            }
          }
          throw new Error('Wrong credentials!')
        } catch (error) {
          console.error(error)
          throw new Error(error)
        }
      },
    }),
  ],
  pages: {
    error: '/',
  },
  // callbacks: {
  //   async signIn({ user, account, profile, email, credentials }) {
  //     console.log({ user, account, profile, email, credentials })
  //     if (account?.provider === 'google') {
  //       return '/test'
  //     } else {
  //       return '/'
  //     }
  //   }
  // }
})

export { handler as GET, handler as POST }
