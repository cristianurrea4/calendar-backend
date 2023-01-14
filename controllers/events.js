const { response } = require("express");
const Event = require("../models/Event");

const getEvents = async (req, res = response) => {
  const events = await Event.find().populate("user", "name");

  return res.status(201).json({
    ok: true,
    events,
  });
};

const createEvent = async (req, res = response) => {
  const event = new Event(req.body);
  try {
    event.user = req.uid;

    const eventSave = await event.save();
    return res.status(201).json({
      ok: true,
      event: eventSave,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const updateEvent = async (req, res = response) => {
  const eventId = req.params.id;
  const uid = req.uid;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        ok: false,
        msg: "La id de evento no existe",
      });
    }

    if (event.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene privilegio de editar este evento",
      });
    }

    const newEvent = {
      ...req.body,
      user: uid,
    };

    const updateEvent = await Event.findByIdAndUpdate(eventId, newEvent, {
      new: true,
    }); // El tercer parametro son opciones opcionales por ejemplo new: true que me devuelve la repuesta con los cambios actualizados
    return res.status(201).json({
      ok: true,
      event: updateEvent,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const deleteEvent = async (req, res = response) => {
  const eventId = req.params.id;
  const uid = req.uid;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        ok: false,
        msg: "La id de evento no existe",
      });
    }

    if (event.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene privilegio para eliminar este evento",
      });
    }
    const deleteEvent = await Event.findByIdAndDelete(eventId)
    return res.status(201).json({
      ok: true,
    });
  } catch (error) {
    return res.status(201).json({
      ok: true,
      event: deleteEvent,
    });
  }
};

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};
