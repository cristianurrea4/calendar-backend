/*
Rutas de Usuarios/Events
host + /api/events
*/
const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/validate-fields");
const { isDate } = require("../helpers/isDate");

const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/events");
const { validateJWT } = require("../middlewares/validate-jwt");

const router = Router();

// Validación JWT ahora están protegidas
router.use(validateJWT);

// Obtener eventos
router.get("/", getEvents);

// Crear un nuevo evento
router.post(
  "/",
  [
    check("title", "El título es obligatorio").not().isEmpty(),
    check("start", "La fecha de inicio es obligatoria").custom(isDate), // isDate validación personalizada
    check("end", "La fecha de finalización es obligatoria").custom(isDate),
    validateFields,
  ],
  createEvent
);

// Crear un nuevo evento
router.put("/:id", updateEvent);

// Elimiar evento
router.delete("/:id", deleteEvent);

module.exports = router;
