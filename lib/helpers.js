const verifyNoUserInput = function(input1, input2, input3) {
  if(!input1 || !input2 || !input3) {
    return false;
  }
  return true;
}

module.exports = { verifyNoUserInput }
