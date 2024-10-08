"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/database.ts
var database_exports = {};
__export(database_exports, {
  config: () => config2,
  knex: () => knex
});
module.exports = __toCommonJS(database_exports);
var import_knex = require("knex");
var import_config = require("dotenv/config");

// src/env/index.ts
var import_dotenv = require("dotenv");
var import_path = require("path");
var import_zod = require("zod");
var envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
(0, import_dotenv.config)({ path: (0, import_path.join)(__dirname, envFile) });
var envSchema = import_zod.z.object({
  NODE_ENV: import_zod.z.enum(["development", "test", "production"]).default("development"),
  DB_URL: import_zod.z.string(),
  PORT: import_zod.z.string()
});
var _env = envSchema.safeParse(process.env);
if (_env.success === false) {
  console.error("Environment variable error", _env.error?.format());
  throw new Error("Environment variable error");
}
var env = _env.data;

// src/database.ts
var config2 = {
  client: "sqlite",
  connection: {
    filename: env.DB_URL
  },
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "db/migrations"
  }
};
var knex = (0, import_knex.knex)(config2);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  config,
  knex
});
