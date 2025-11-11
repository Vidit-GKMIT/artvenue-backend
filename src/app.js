import express from "express";
import morgan from "morgan";
import authRouter from "./routes/auth.route.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/auth", authRouter);


app.get('/', async (req, res) => {
  const newUser = await prisma.user.create({
        data: {
          id: 1,
          name: 'Alice',
          email: 'alice@example.com',
        },
      });
      console.log('Created new user:', newUser);
      return res.status(200).json({ message: "created new user" });
});

app.use((err, req, res, next) => {
  return res.status(500).json({
    message: "Something went wrong!!",
    err: err.message,
  });
});

//app.use('*', (req, res) => {
//   res.status(404).json({message: "not found"});
// });



export default app;