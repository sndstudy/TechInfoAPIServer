import * as Express from "express";

// const router = Express.Router();

// router.get("/", (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
//     res.status(501).json({ message: 'Not Implemented.' });
// });

const app = Express();

app.get("/", (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    return res.send("Hello Nyanko.");
});

app.listen(3000, () => {
    console.log("Listen on port 3000.");
});
