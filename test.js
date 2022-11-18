async function init() {
  console.log(1);
  await sleep(6000);
  console.log(2);
  await sleep(6000);
  console.log(3);
  await sleep(6000);
  console.log(4);
  await sleep(6000);
  console.log(5);
  await sleep(6000);
  console.log(6);
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

init();
// const numberToHex = (number) => `0x${number.toString(16)}`;
const numberToHex = (number) => `0x${number.toString(16)}`;
console.log(numberToHex(0x2daf72078));
