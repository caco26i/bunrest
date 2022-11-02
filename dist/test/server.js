"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../index"));
const app = (0, index_1.default)();
const router = app.router();
// var whitelist = ["localhost:3000"];
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
// };
//app.use(cors(corsOptions));
app.get("/user", (req, res) => {
    res.status(200).json(req.body);
});
app.post('/', (req, res) => {
    res.status(200).send("app post");
});
app.use((req, res, next) => {
    console.log('middle ware');
    next();
});
// app.get('/', (req, res) => {
//   console.log('not handle')
//   // res.status(200).send("app get")
// })
router.use((req, res, next) => {
    console.log('router middleware');
});
router.get('/', (req, res) => {
    res.status(200).send("route get");
});
router.post('/', (req, res) => {
    res.status(200).send("router post");
});
// app.use((req, res, next) => {
//   res.status(400).send('Yoy')
// })
// app.use((req, res, next) => {
//   res.status(400).send('Not found')
// })
app.use('/', router);
// app.use((req, res, next, err) => {
//     res.status(500).send('Error happened');
//  });
app.listen(3000, () => {
    console.log("Running on port 3000");
});
