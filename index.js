const express = require('express');
const cors = require('cors');

const router = require('./routes/routes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(router)

const PORTA = 3333;

app.listen(PORTA, 
    () => {
        console.log(`Server running in http://localhost:${PORTA}`)
    }
)

app.get('/', 
    (req, res)=>{
        res.send('Hello World');
    })
