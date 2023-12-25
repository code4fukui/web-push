/**
 * @param {string} base64
 * @returns {boolean}
 */
function validate(base64) {
  return /^[A-Za-z0-9\-_]+$/.test(base64);
}

export default {
  validate: validate
};
