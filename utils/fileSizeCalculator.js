const sizeCalc = (base64String) => {
  let y = 1;
  if (base64String.endsWith("==")) {
    let y = 2;
  }
  const size = (base64String.length * 3) / 4 - y;
  return Math.ceil(size/1000000);
};


export default sizeCalc