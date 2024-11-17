import { app } from "../app.mjs";
import { getUser, adminGuard } from "../guard.mjs";
import { User } from "./users.model.mjs";

app.get("/users", adminGuard, async (req, res) => {
    if (req.isAdmin) {
        res.send(await User.find());
    } else {
        res.status(401).send("User is not authorized");
    }
});

app.patch("/users/:id", adminGuard, async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(404).send({ message: "User not found" });
    }

    user.isAdmin = !user.isAdmin;
    await user.save();

    res.send(user);
});

app.delete("/users/:id", adminGuard, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).send("User not found");
        }

        if (getUser(req).isAdmin) {
            await User.findByIdAndDelete(req.params.id);
            res.send("User deleted");
        } else {
            res.status(401).send("User is not authorized");
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.put("/users/:id", adminGuard, async (req, res) => {
    const { firstName, lastName, email, phone } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(403).send({ message: "User not found" });
    }
    if (user) {
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.phone = phone;
        user.updatedAt = new Date();

        await user.save();
        res.send(user);
    } else {
        res.status(401).send("User is not authorized");
    }
});
