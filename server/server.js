import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors'; // parece ser la rspuesta ancestral 20/6/23 TG
import { Configuration, OpenAIApi } from 'openai';

dotenv.config(); // para poder usar las dotenvs

console.log("la clave de la juventud "+ process.env.OPENAI_API_KEY);

const configuration = new Configuration({ // esto es de la api de openai 20/6/23 TG
   apiKey: process.env.OPENAI_API_KEY, 
});

const openai = new OpenAIApi(configuration);

const app = express(); // esto sirve para saber ni qué onda
app.use(cors()); // posibe respuesta a la consulta ancestral del #cors para hacer cross origin requests dice mr. Adrian 20/6/23 TG
app.use(express.json()); // para pasar el json TG

app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello from your smarter Brain',
    })

}); 
app.post('/', async(req, res) => {
    try {
        const prompt = req.body.prompt;

        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0, // risks que va a tomar el chatío, estaba en 0 y sigue en 0
            max_tokens: 3000, // el tamañon de la respuestona, estaba en 64
            top_p: 1,
            frequency_penalty: 0.5, //que no repita similar sentences often y de un respuestaje más variado, estaba en 0
            presence_penalty: 0,
        })

        res.status(200).send({
            bot: response.data.choices[0].text
        });

    } catch (error){
        console.error(error);//"mijo, le dio error!");
        res.status(500).send(error || "se salió del canasto, mijo!");
    }
});

app.listen(5000, () => console.log('server is ruuningz como locous!!! on port http://localhost:5000')); // esto es para que siempre esté escuchando y no solo hablando todo el tiempo TG 20/6/23 TG