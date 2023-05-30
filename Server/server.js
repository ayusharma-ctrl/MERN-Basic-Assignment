import express from 'express'
import clc from 'cli-color';
import { config } from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

//file-imports
import { mongoDbConnection } from './database/dbConnection.js';
import userRoutes from './routes/userRoutes.js';
import taskRouter from './routes/taskRoutes.js'

//creates a new instance of an Express application
const app = express();

//initializing ".env" file at the beginning so that we can use content of it
config({
    path: "./.env"
})

//connecting server and database, just call this func^
mongoDbConnection();

// <-------------------------------------------Middlewares Declaration------------------------------------------->

// 1. we'll be sending data in json format, that's why it is required to use this middleware
app.use(express.json());

// 2. we'll be using dynamic routes, in order to read the data from url we have to use this
app.use(express.urlencoded({ extended: true }));

// 3. by using the cookie-parser middleware, it parses the cookies sent with each request and populates the req.cookies object, allowing you to access the values stored in cookies
app.use(cookieParser());

// 4. set 'credentials: true' to pass --> headers, cookies, etc to client
app.use(cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))

// 5. route splitting
app.use("/api/user", userRoutes);
app.use("/api/task", taskRouter);

// <-------------------------------------------Middlewares Declaration------------------------------------------->

// it is a test route just to see our server is working
app.get("/", (req, res) => {
    return res.send(`<div style = "background:magenta;padding:100px;height:60vh"><h2>Welcome to My Todo App Server</h2>
    <p>Features...</p>
        <div><ul>
            <li>Protected Routes</li>
            <li>Pagination</li>
            <li>Perform CRUD Operations</li>
            <li>Much more...</li>
        </ul></div>
    </div>`)
})

// finally server to listen all the http requests
app.listen(process.env.PORT, () => {
    console.log(clc.magentaBright.italic(`Server is running on port ${process.env.PORT}`))
})