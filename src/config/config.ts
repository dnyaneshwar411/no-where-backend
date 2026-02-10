import dotenv from "dotenv";
import path from "path";
import Joi from "joi";

dotenv.config({ path: path.join(__dirname, "../../.env") });

const envVarSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("production", "development", "test")
      .required(),
    PORT: Joi.number().default(1221),
    MONGODB_URL: Joi.string().required().description("Mongo DB url"),
    JWT_SECRET_KEY: Joi.string().required(),
    JWT_EXPIRATION: Joi.string().required(),
    WEB_SOCKET_PORT: Joi.number().default(1223),
  })
  .unknown();

const { value: envVars, error } = envVarSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URL,
  },
  cookieExpirationDuration: 60 * 60 * 24,
  jwtSecretKey: envVars.JWT_SECRET_KEY,
  jwtExpiration: envVars.JWT_EXPIRATION,
  wssPort: envVars.WEB_SOCKET_PORT
};
