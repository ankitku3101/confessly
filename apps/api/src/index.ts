import { log } from 'console';
import express, {Request, Response} from 'express'

const app = express();
const PORT=3000;

app.get('/', (req: Request, res: Response)=> {
    res.send("Testing express");
});

app.listen(PORT, () => {
    console.log(`Server running on https://localhost:${PORT}`);
})