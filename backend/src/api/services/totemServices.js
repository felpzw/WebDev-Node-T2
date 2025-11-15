const Totem = require('../../models/totem'); // Verifique o caminho para seu modelo
const crypto = require('crypto'); // Módulo nativo do Node.js para gerar tokens

/**
 * Lista todos os totems registrados (para o admin).
 */
const listTotems = async () => {
  // Oculta o authToken da listagem por segurança
  return Totem.find({}, '-authToken');
};

/**
 * Cria um novo totem e gera um token de autenticação único para ele.
 */
const createTotem = async (name) => {
  if (!name) {
    throw new Error('O nome do totem é obrigatório');
  }
  
  // Gera um token seguro de 32 bytes em formato hexadecimal
  const authToken = crypto.randomBytes(32).toString('hex');
  
  const totem = new Totem({
    name,
    authToken,
  });
  
  await totem.save();
  // Retorna o totem, incluindo o token, para que o admin possa copiá-lo
  return totem;
};

/**
 * Remove um totem por ID.
 */
const deleteTotem = async (totemId) => {
  const totem = await Totem.findByIdAndDelete(totemId);
  if (!totem) {
    throw new Error('Totem não encontrado');
  }
  return totem;
};

/**
 * Valida o token de um totem.
 * Esta será a função mais importante para o Socket.io.
 */
const validateTotemToken = async (token) => {
  const totem = await Totem.findOne({ authToken: token });
  
  if (!totem) {
    return null; // Token inválido ou não encontrado
  }
  
  // (Opcional, mas recomendado) Atualiza o "visto por último"
  totem.lastSeen = new Date();
  await totem.save();
  
  return totem; // Token válido!
};

module.exports = {
  listTotems,
  createTotem,
  deleteTotem,
  validateTotemToken,
};