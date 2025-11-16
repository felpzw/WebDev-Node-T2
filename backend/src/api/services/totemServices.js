const Totem = require('../../models/totems'); 
const crypto = require('crypto'); 


const listTotems = async () => {

  return Totem.find({}, '-authToken');
};


const createTotem = async (name) => {
  if (!name) {
    throw new Error('O nome do totem é obrigatório');
  }
  
  
  const authToken = crypto.randomBytes(32).toString('hex');
  
  const totem = new Totem({
    name,
    authToken,
  });
  
  await totem.save();
  
  return totem;
};

const deleteTotem = async (totemId) => {
  const totem = await Totem.findByIdAndDelete(totemId);
  if (!totem) {
    throw new Error('Totem not found');
  }
  return totem;
};


const validateTotemToken = async (token) => {
  const totem = await Totem.findOne({ authToken: token });
  
  if (!totem) {
    return null; 
  }
  
  totem.lastSeen = new Date();
  await totem.save();
  
  return totem;
};

module.exports = {
  listTotems,
  createTotem,
  deleteTotem,
  validateTotemToken,
};