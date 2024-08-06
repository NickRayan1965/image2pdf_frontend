const replacer = (text, expression, replacer) => {
  while (text.includes(expression)) {
    text = text.replace(expression, replacer);
  }
  return text;
};
export const getDecodedPaths = (code) => {
  // const code = fullUrl.substring(
  //   fullUrl.indexOf('imagePaths') + 11,
  //   fullUrl.length
  // );
  const decoded = decodeURIComponent(code);
  let cleanDecoded = decoded;
  cleanDecoded = replacer(cleanDecoded, '\n\n\n\n\n\n\r\n', '');
  cleanDecoded = replacer(cleanDecoded, '\n\n\n\n\n\n', '');
  return cleanDecoded.split('>');
};
