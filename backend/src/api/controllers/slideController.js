const slideService = require('../services/slideServices');
//possivel socket service aqui - lembrar de testar.
// add socket service

const { broadcastSlidesUpdate } = require('../services/socketService');


const list = async (req, res) => {
  try {
    const slides = await slideService.listAllSlides();
    res.json(slides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const slide = await slideService.createSlide(req.body);

    broadcastSlidesUpdate();

    res.status(201).json(slide);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const update = async (req, res) => {
  try {
    const slideId = req.params.id;
    const slideData = req.body;
    
    const slide = await slideService.updateSlide(slideId, slideData);

    broadcastSlidesUpdate();
    
    res.json(slide);
  } catch (error) {
    if (error.message === 'Slide not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(400).json({ message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const slideId = req.params.id;
    await slideService.deleteSlide(slideId);

    broadcastSlidesUpdate();
    
    res.status(204).send(); 
  } catch (error) {
    if (error.message === 'Slide not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  list,
  create,
  update,
  remove,
};