const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('./routes/routes');
const path = require('path');
const app = express();

app.use(cors({
    origin: 'http://localhost:3000', // Ou o domínio do front-end
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(router)
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(express.json({ limit: '10mb' }));



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
