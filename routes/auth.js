/*
Rutas de Usuarios/Auth
host + /api/auth
*/
const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/validate-fields");
const { createUser, loginUser, validateToken } = require("../controllers/auth");
const router = Router();
const { validateJWT } = require("../middlewares/validate-jwt");
router.post(
  "/new",
  [
    // middlewers
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    check("password", "La contraseña debe de ser de 6 caracteres").isLength({
      min: 6,
    }),
    validateFields,
  ],
  createUser
);
router.post(
  "/",
  [
    check("email", "El email es obligatorio").isEmail(),
    check("password", "La contraseña debe de ser de 6 caracteres").isLength({
      min: 6,
    }),
    validateFields,
  ],
  loginUser
);
router.get("/renew", validateJWT, validateToken);

module.exports = router;
