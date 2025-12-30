// src/app/lib/setAdmin.ts
import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { createRequire } from "module";
const require = createRequire(import.meta.url); // 👈 Fix for ESM + JSON

const serviceAccount = require("./serviceAccountKey.json") as ServiceAccount;

const uid = "VSup4GwYkPMPa2p5xRSnzQAT6Fa2";

initializeApp({
  credential: cert(serviceAccount),
});

getAuth()
  .setCustomUserClaims(uid, { role: "admin" })
  .then(() => {
    console.log(`✅ Custom claim set for admin: ${uid}`);
  })
  .catch(console.error);
