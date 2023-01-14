const { response } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { generateJWT } = require("../helpers/jwt");

const createUser = async (req, res = response) => {
  const { email, password } = req.body; // Toda la información

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        ok: false,
        msg: "Usuario ya existe con ese email",
      });
    }
    user = new User(req.body);

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    await user.save();

    // Generar token (Jason Web Token)
    const token = await generateJWT(user.id, user.name);

    res.status(201).json({
      ok: true,
      uid: user.id,
      name: user.name,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const loginUser = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: "Usuario no existe con ese email",
      });
    }

    // Confirmar las contraseñas
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      res.status(400).json({
        ok: false,
        msg: "La contraseña es incorrecta",
      });
    }

    // Generar token (Jason Web Token)
    const token = await generateJWT(user.id, user.name);

    res.status(201).json({
      ok: true,
      uid: user.id,
      name: user.name,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const validateToken = async(req, res = response) => {
  const { uid, name } = req.uid;

  // Generar nuevo JWT y retornar en esta petición
  const token = await generateJWT(uid, name);

  res.json({
    ok: true,
    name,
    uid,
    token
  });
};

module.exports = {
  createUser,
  loginUser,
  validateToken,
};
