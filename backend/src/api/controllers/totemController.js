const totemService = require('../services/totemService');

const list = async (req, res) => {
  try {
    const totems = await totemService.listTotems();
    res.json(totems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { name } = req.body;
    const totem = await totemService.createTotem(name);

    res.status(201).json(totem);
  } catch (error) {

    res.status(400).json({ message: error.message });
  }
};


const remove = async (req, res) => {
  try {
    const totemId = req.params.id;
    await totemService.deleteTotem(totemId);
    res.status(204).send(); 
  } catch (error) {
    if (error.message === 'Totem not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  list,
  create,
  remove,
};