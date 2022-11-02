"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = __importDefault(require("../src"));
const app = (0, src_1.default)();
const router = app.router();
router.get('/', (req, res) => {
    res.status(200).send('GET /route');
});
router.post('/', (req, res) => {
    res.status(200).send('POST /route');
});
router.put('/', (req, res) => {
    res.status(200).send('PUT /route');
});
router.delete('/', (req, res) => {
    res.status(200).send('DELETE /route');
});
router.options('/', (req, res) => {
    res.status(200).send('OPTIONS /route');
});
exports.default = router;
