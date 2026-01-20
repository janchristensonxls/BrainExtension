import process from "node:process";
import { betterAuth } from "better-auth";
import { jazzPlugin } from "jazz-tools/better-auth/auth/server";
import { JazzBetterAuthDatabaseAdapter } from "jazz-tools/better-auth/database-adapter";
import "dotenv/config";

const apiKey = process.env.VITE_JAZZ_API_KEY;

export const auth = betterAuth({
  database: JazzBetterAuthDatabaseAdapter({
    syncServer: `wss://cloud.jazz.tools/?key=${apiKey}`,
    accountID: process.env.JAZZ_WORKER_ACCOUNT!,
    accountSecret: process.env.JAZZ_WORKER_SECRET!,
  }),
  // Allow requests from the frontend development server
  trustedOrigins: ["http://localhost:3000"],
  emailAndPassword: {
    enabled: true,
    // sendResetPassword(data, request) {
    //   await sendEmail
    // },
  },
  plugins: [jazzPlugin()],
  //   socialProviders: {
  //     github: {
  //       clientId: env.GITHUB_CLIENT_ID,
  //       clientSecret: env.GITHUB_CLIENT_SECRET,
  //     },
  //     google: {
  //       clientId: env.GOOGLE_CLIENT_ID,
  //       clientSecret: env.GOOGLE_CLIENT_SECRET,
  //     },
  //   },
});
