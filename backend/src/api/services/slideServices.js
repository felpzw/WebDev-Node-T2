const Slide = require('../../models/slides'); 


const listAllSlides = async () => {
  return Slide.find({}).sort({ createdAt: -1 });
};

const listValidSlides = async () => {
  return Slide.find({ expirationDate: { $gt: new Date() } });
};


const createSlide = async (slideData) => {
  const slide = new Slide(slideData);
  await slide.save();
  return slide;
};

const updateSlide = async (slideId, slideData) => {
  const slide = await Slide.findByIdAndUpdate(slideId, slideData, { new: true });
  if (!slide) {
    throw new Error('Slide not found');
  }
  return slide;
};


const deleteSlide = async (slideId) => {
  const slide = await Slide.findByIdAndDelete(slideId);
  if (!slide) {
    throw new Error('Slide not found');
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