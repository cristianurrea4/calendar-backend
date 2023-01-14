const { response } = require("express");
const jwt = require("jsonwebtoken");

const validateJWT = (req, res = response, next) => {
  // x-token headers
  const token = req.header("x-token");

  // Validar
  if (!token) {
    return res.status(400).json({
      ok: false,
      msg: "No hay token en la petición",
    });
  }

  try {
    const { uid, name } = jwt.verify(token, process.env.SECRET_JWT_SEED); // Saber el id del usuario
    req.uid = uid;
    req.name = name;
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: "Token no válido",
    });
  }
  next();
};

module.exports = {
  validateJWT,
};
