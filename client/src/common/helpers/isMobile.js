/**
 * Detect if the device is mobile.
 *
 * Simply detects the user agent and compares it to knowkn mobile browsers. This
 * method is not recommended but is sufficient for the purposes of this app.
 */
const regex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;

export default function isMobile() {
  return regex.test(navigator.userAgent);
}
