const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const formatHKID = (str) => str.replace(/[\(\)]/g, '').toUpperCase();

const processHKID = (str) => {
    const formattedStr = formatHKID(str);
    const hkidRegex = /^([A-Z]{1,2})([0-9]{6})([A0-9])$/;
    return formattedStr.toUpperCase().match(hkidRegex);
};

const calculateCheckDigit = (charPart, numPart) => {
    if (charPart.length > 3) {
        return false;
    }

    if (numPart.length !== 6) {
        return false;
    }

    const strValidChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let checkSum = 0;
    if (charPart.length === 2) {
      checkSum += 9 * (10 + strValidChars.indexOf(charPart.charAt(0)));
      checkSum += 8 * (10 + strValidChars.indexOf(charPart.charAt(1)));
    } else {
      checkSum += 9 * 36;
      checkSum += 8 * (10 + strValidChars.indexOf(charPart));
    }

    for (let i = 0, j = 7; i < numPart.length; i++, j--) checkSum += j * numPart.charAt(i);

    const remaining = checkSum % 11;
    const verify = remaining === 0 ? 0 : (11 - remaining === 10 ? 'A' : 11 - remaining);
  
    return verify;
};

const randomHKID = () => {
    const hkidMode = getRandomInt(1, 10);

    let randomAlphabet = String.fromCharCode(getRandomInt(65, 90));
    if (hkidMode === 10) {
      randomAlphabet += String.fromCharCode(getRandomInt(65, 90));
    }
  
    let randomNumber = '';
    for (let i = 0; i < 6; i++) {
      randomNumber += String(getRandomInt(0, 9));
    }
  
    const checkdigit = calculateCheckDigit(randomAlphabet, randomNumber);
    //console.log(`Generating HKID...\n\nAlphabet: \t\t${randomAlphabet}\nNumber: \t\t${randomNumber}\nResult: \t\t${checkdigit}`);
    return randomAlphabet + randomNumber + checkdigit;
};

const isHKID = (str) => {
    if (!str) {
      return false;
    }
  
    const uppercaseStr = formatHKID(str);
    if (uppercaseStr.length < 8 || uppercaseStr.length > 9) {
      return false;
    }
  
    const matchArray = processHKID(uppercaseStr);
    if (!matchArray) {
      return false;
    }
  
    const verify = calculateCheckDigit(matchArray[1], matchArray[2]);
    //console.log(`Valid check digit: \t${verify}`);
    return verify.toString() === matchArray[3].toString();
};

export { randomHKID, isHKID, processHKID, calculateCheckDigit };