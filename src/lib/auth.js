import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";

// One MongoDB connection, reused while the dev server hot reloads
const globalForMongo = globalThis as unknown as { _authMongoClient?: MongoClient };

const client =
  globalForMongo._authMongoClient ?? new MongoClient(process.env.MONGODB_URL as string);

if (process.env.NODE_ENV !== "production") {
  globalForMongo._authMongoClient = client;
}

const db = client.db(process.env.MONGODB_DB || "booknook");

export const auth = betterAuth({
  // must be the same value as AUTH_URL on the Express server
  baseURL: process.env.BETTER_AUTH_URL,

  database: mongodbAdapter(db),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6, // BetterAuth default is 8, our rule is 6
    autoSignIn: false, // after register the user goes to the Login page
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  plugins: [
    jwt(), // gives the Express server a token it can verify
    nextCookies(), // keep this last
  ],
});