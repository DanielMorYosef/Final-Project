import { User } from "./users.model.mjs";
import bcrypt from "bcrypt";
import { users } from "./usersInitialData.mjs";

(async () => {
    try {
        const userCount = await User.find().countDocuments();

        if (userCount === 0) {
            for (const userData of users.users) {
                const hashedPassword = await bcrypt.hash(userData.password, 10);
                const user = new User({
                    ...userData,
                    password: hashedPassword,
                });
                await user.save();
            }
            console.log("Initial users have been added to the database.");
        }
    } catch (error) {
        console.error("Error in users.service.mjs:", error);
    }
})();
