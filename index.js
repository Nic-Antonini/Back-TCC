const express = require('express');

const app = express()

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

//req = requisição
//res = resposta