export const isBangla = (str) => {
  for (var i = 0, n = str.length; i < n; i++) {
    if (str.charCodeAt(i) > 255) {
      return true;
    }
  }
  return false;
};

export const smsCount = (str) => {
  const isBangla = [...str].some((char) => char.charCodeAt(0) > 255);
  const singleSms = isBangla ? 67 : 160;

  return Math.ceil(str.length / singleSms);
};
