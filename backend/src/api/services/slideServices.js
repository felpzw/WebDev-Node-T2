const Slide = require('../../models/slide'); // Verifique o caminho para seu modelo

/**
 * Lista todos os slides (para o painel do admin).
 */
const listAllSlides = async () => {
  // O admin vê todos, incluindo expirados, ordenados do mais novo para o mais antigo
  return Slide.find({}).sort({ createdAt: -1 });
};

/**
 * Lista apenas slides válidos (para os totems).
 * Slides válidos são aqueles cuja data de expiração ainda não passou.
 */
const listValidSlides = async () => {
  return Slide.find({ expirationDate: { $gt: new Date() } });
};

/**
 * Cria um novo slide no banco de dados.
 */
const createSlide = async (slideData) => {
  // slideData será o req.body (título, duração, conteúdo, etc.)
  const slide = new Slide(slideData);
  await slide.save();
  return slide;
};

/**
 * Atualiza um slide existente por ID.
 */
const updateSlide = async (slideId, slideData) => {
  // { new: true } garante que a função retorne o documento atualizado
  const slide = await Slide.findByIdAndUpdate(slideId, slideData, { new: true });
  if (!slide) {
    throw new Error('Slide não encontrado');
  }
  return slide;
};

/**
 * Remove um slide por ID.
 */
const deleteSlide = async (slideId) => {
  const slide = await Slide.findByIdAndDelete(slideId);
  if (!slide) {
    throw new Error('Slide não encontrado');
  }
  return slide;
};

module.exports = {
  listAllSlides,
  listValidSlides,
  createSlide,
  updateSlide,
  deleteSlide,
};