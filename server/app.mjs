import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import chalk from "chalk";
import moment from "moment";

dotenv.config();

async function main() {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("mongodb connection established on port 27017");
}

main().catch((err) => console.log(err));

export const app = express();

app.use(express.json());

app.use(morgan(":method :url :status :date[iso] :response-time ms"));

app.use(
    morgan((tokens, req, res) => {
        const status = tokens.status(req, res);

        return [
            chalk.blue(tokens.method(req, res)),
            chalk.green(tokens.url(req, res)),
            status >= 200 && status < 400
                ? chalk.bgGreen(tokens.status(req, res))
                : chalk.bgRed(tokens.status(req, res)),
            chalk.gray(moment().format("YYYY-MM-DD HH:mm")),
            chalk.bgBlack(tokens["response-time"](req, res), "ms"),
        ].join(" ");
    })
);

app.use(
    cors({
        origin: true,
        credentials: true,
        methods: "GET,PUT,POST,PATCH,DELETE,OPTIONS",
        allowedHeaders: "Content-Type, Accept, Authorization",
    })
);

app.listen(process.env.PORT, () => {
    console.log("listening on port 8989");
});

(async () => {
    await import("./users/auth.mjs");
    await import("./users/users-service.mjs");
    await import("./users/usersRoutes.mjs");

    await import("./exercises/exercisesInitialData.mjs");
    await import("./exercises/exercises.service.mjs");
    await import("./exercises/exercisesRoutes.mjs");

    await import("./workout/workout.routes.mjs");
    await import("./workoutLogs/workoutLog.routes.mjs");
})();
