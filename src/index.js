import vapidHelper from './vapid-helper.js';
import encryptionHelper from './encryption-helper.js';
import WebPushLib from './web-push-lib.js';
import WebPushError from './web-push-error.js';
import WebPushConstants from './web-push-constants.js';

const webPush = new WebPushLib();

export default {
  WebPushError: WebPushError,
  supportedContentEncodings: WebPushConstants.supportedContentEncodings,
  encrypt: encryptionHelper.encrypt,
  getVapidHeaders: vapidHelper.getVapidHeaders,
  generateVAPIDKeys: vapidHelper.generateVAPIDKeys,
  setGCMAPIKey: webPush.setGCMAPIKey,
  setVapidDetails: webPush.setVapidDetails,
  generateRequestDetails: webPush.generateRequestDetails,
  sendNotification: webPush.sendNotification.bind(webPush)
};
