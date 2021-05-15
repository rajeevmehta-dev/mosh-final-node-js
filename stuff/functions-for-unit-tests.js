// Testing numbers 
module.exports.absolute = function(number) {
  // if (number >= 0) return number; 
  // return -number; 

  // OR

  return (number>=0) ? number : -number

/*  example of refactring the code, the output remains the same which,
  can be checked by testing */
}

// Testing strings 
module.exports.greet = function(name) { 
  return 'Welcome ' + name; 
}

// // Testing arrays 
module.exports.getCurrencies = function() { 
  return ['USD', 'AUD', 'EUR'];
}

// Testing objects 
module.exports.getProduct = function(productId) { 
  return { id: productId, price: 10,category:'Clothing' };
}

// // Testing exceptions 
module.exports.registerUser = function(username) { 
  if (!username) throw new Error('Username is required.');

  return { id: new Date().getTime(), username: username }
}
