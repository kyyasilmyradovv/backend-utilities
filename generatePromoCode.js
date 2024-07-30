// This function will generate and return promo code/s

// Import the sequelize model for promo codes
const { PromoCodes } = require('./../../models');

// A function that generates single promo code
const generateSingleCode = async () => {
  // You can change characters you want to use in your promo codes!
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  // Set the length of promo code. You can change this also!
  const codeLength = 6;

  let code = '';

  // Generate the code
  for (let i = 0; i < codeLength; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }

  // Check if this code exists on the database (in most cases every promo code must be unique)
  const existingCode = await PromoCodes.findOne({ where: { code } });
  
  // If generated code exists then create new one
  if (existingCode) return generateSingleCode();

  // Return the generated unique promo code
  return code;
};

// A function generates bulk of promo codes
exports.generatePromoCodes = async (count) => {
  const promos = [];

  // Generate demanded number of promo codes
  for (let i = 0; i < count; i++) {
    const newCode = await generateSingleCode();
    promos.push(newCode);
  }

  // Return generated promo codes array
  return promos;
};
