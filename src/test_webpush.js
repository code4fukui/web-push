import webpush from "./index.js";

// VAPID keys should be generated only once.
const vapidKeys = webpush.generateVAPIDKeys();

console.log(vapidKeys);
/*
//webpush.setGCMAPIKey('<Your GCM API Key Here>');
webpush.setVapidDetails(
  'mailto:example@yourdomain.org',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);
*/
