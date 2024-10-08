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

// src/services/tasks.ts
var tasks_exports = {};
__export(tasks_exports, {
  default: () => TaskService
});
module.exports = __toCommonJS(tasks_exports);

// src/database.ts
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

// src/services/tasks.ts
var TaskService = class {
  constructor() {
    this.model = knex;
  }
  async create(task) {
    await knex("tasks").insert(task);
  }
  async getTasks() {
    return await knex("tasks").select(
      "title",
      "description",
      "completed_at",
      "created_at",
      "updated_at"
    );
  }
  async updateTaskById(id, title, description) {
    return await knex("tasks").where({ id }).update({
      title,
      description,
      updated_at: knex.fn.now()
    });
  }
  async deleteTaskById(id) {
    return await knex("tasks").where({ id }).del();
  }
  async completeATaskById(id) {
    return await knex("tasks").where({ id }).update({
      completed_at: knex.fn.now(),
      updated_at: knex.fn.now()
    }).returning([
      "title",
      "description",
      "completed_at",
      "created_at",
      "updated_at"
    ]);
  }
};
