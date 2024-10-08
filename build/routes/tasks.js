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

// src/routes/tasks.ts
var tasks_exports = {};
__export(tasks_exports, {
  tasksRoutes: () => tasksRoutes
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

// src/schemas/tasks.ts
var import_zod2 = require("zod");
var createTaskBodySchema = import_zod2.z.object({
  title: import_zod2.z.string(),
  description: import_zod2.z.string()
});
var idSchema = import_zod2.z.object({
  id: import_zod2.z.string().uuid()
});
var updateTaskBodySchema = import_zod2.z.object({
  title: import_zod2.z.string().optional(),
  description: import_zod2.z.string().optional()
}).refine(
  (data) => {
    return data.title || data.description;
  },
  {
    message: "At least one field must be provided"
  }
);

// src/controllers/tasks.ts
var import_crypto = require("crypto");
var TaskController = class {
  constructor(req, reply) {
    this.req = req;
    this.reply = reply;
    this.service = new TaskService();
  }
  async createTask() {
    try {
      const newTask = createTaskBodySchema.parse(this.req.body);
      await this.service.create({
        id: (0, import_crypto.randomUUID)(),
        ...newTask
      });
      this.reply.status(201).send();
    } catch (error) {
      this.reply.status(500).send({ error });
    }
  }
  async getTasks() {
    try {
      const tasks = await this.service.getTasks();
      this.reply.status(200).send(tasks);
    } catch (error) {
      this.reply.status(500).send({ error });
    }
  }
  async updateTask() {
    try {
      const { id } = idSchema.parse(this.req.params);
      const { title, description } = updateTaskBodySchema.parse(this.req.body);
      const updatedTask = await this.service.updateTaskById(
        id,
        title,
        description
      );
      if (!updatedTask) {
        return this.reply.status(404).send({ message: "Task not found" });
      }
      this.reply.status(201).send(updatedTask);
    } catch (error) {
      this.reply.status(500).send({ error });
    }
  }
  async deleteTask() {
    try {
      const { id } = idSchema.parse(this.req.params);
      const deletedTask = await this.service.deleteTaskById(id);
      if (!deletedTask) {
        return this.reply.status(404).send({ message: "Task not found" });
      }
      return this.reply.status(204).send();
    } catch (error) {
      this.reply.status(500).send({ error });
    }
  }
  async completeTask() {
    try {
      const { id } = idSchema.parse(this.req.params);
      const [{ completed_at: completedAt }] = await this.service.completeATaskById(id);
      if (!completedAt) {
        return this.reply.status(404).send({ message: "Task not found" });
      }
      return this.reply.status(204).send();
    } catch (error) {
      this.reply.status(500).send({ error });
    }
  }
};

// src/routes/tasks.ts
async function tasksRoutes(app) {
  app.post(
    "/",
    async (req, reply) => new TaskController(req, reply).createTask()
  );
  app.get(
    "/",
    async (req, reply) => new TaskController(req, reply).getTasks()
  );
  app.put(
    "/:id",
    async (req, reply) => new TaskController(req, reply).updateTask()
  );
  app.delete(
    "/:id",
    async (req, reply) => new TaskController(req, reply).deleteTask()
  );
  app.patch(
    "/:id/complete",
    async (req, reply) => new TaskController(req, reply).completeTask()
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  tasksRoutes
});
