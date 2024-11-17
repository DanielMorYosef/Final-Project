import { app } from "../app.mjs";
import { User } from "./users.model.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserLogin, UserSignup } from "./users.joi.mjs";

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    const validate = UserLogin.validate({ email, password });

    if (validate.error) {
        return res.status(403).send(validate.error.details[0].message);
    }

    if (!user) {
        return res.status(403).send("email or password is incorrect");
    }
    if (!user.password || !(await bcrypt.compare(password, user.password))) {
        return res.status(403).send("email or password is incorrect");
    }

    const token = jwt.sign(
        {
            _id: user._id,
            isAdmin: user.isAdmin,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
    res.send(token);
});

app.post("/signup", async (req, res) => {
    const { firstName, lastName, email, password, isAdmin, createdAt } =
        req.body;

    const validate = UserSignup.validate(req.body, { allowUnknown: true });

    if (validate.error) {
        return res.status(400).send(validate.error.details[0].message);
    }

    if (await User.findOne({ email })) {
        return res.status(400).send("Already exists");
    }

    const user = new User({
        firstName,
        lastName,
        email,
        password: await bcrypt.hash(password, 10),
        isAdmin,
        createdAt,
    });

    const newUser = await user.save();

    res.status(201).send(newUser);
});
