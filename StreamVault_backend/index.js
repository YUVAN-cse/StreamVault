import dotenv from "dotenv";
dotenv.config();


import app from "./app.js";
import  connectDB  from "./db/connectDB.js";


connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
}).catch((err) => {
    console.error("Failed to connect to the database", err);
});
