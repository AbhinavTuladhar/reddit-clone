import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import Credentials from 'next-auth/providers/credentials';

const googleClientId = process.env.GOOGLE_CLIENT_ID
const googleSecretId = process.env.GOOGLE_CLIENT_SECRET

if (!googleClientId || !googleSecretId) {
  throw new Error('Google client and secret ids are not provided.')
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleSecretId
    })
  ]
})

export { handler as GET, handler as POST }