// Npm requires ↓

const jwt = require("jsonwebtoken");

// Functions requires ↓

const { generateError } = require("../services/generateError");
const { getConnection } = require("../database/connectionDB");

// Middleware ↓

const authUser = async (req, res, next) => {
  let connection;
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      throw generateError(
        "No se ha introducido la cabecera de Authorization",
        401
      );
    }

    // Check if token is correct
    let tokenInfo;

    try {
      tokenInfo = jwt.verify(authorization, process.env.SECRET_TOKEN);
    } catch {
      throw generateError("Token incorrecto", 401);
    }

    connection = await getConnection();

    try {
      // Check lastAuthUpdate
      const [user] = await connection.query(
        `
            SELECT lastAuthUpdate
            FROM users
            WHERE id = ?
            `,
        [tokenInfo.id]
      );

      // Transfrom lastAuthUpdate and timestamp to Date format
      const lastAuthUpdate = new Date(user[0].lastAuthUpdate);
      const timestampCreateToken = new Date(tokenInfo.iat * 1000);

      // Check if token is expired
      if (timestampCreateToken < lastAuthUpdate) {
        throw generateError("Token caducado", 401);
      }

      // Introduces token info in req
      req.userInfo = tokenInfo;
    } catch {
      throw generateError("Usuario no logueado", 409);
    }

    next();
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = authUser;
