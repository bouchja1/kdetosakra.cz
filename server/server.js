const dotenv = require('dotenv');

const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'localhost';
}

if (process.env.NODE_ENV === 'localhost') {
    const dotenvConfig = dotenv.config();
    // na localhostu tahame z .env, v ramci docker-compose se to sype pres args. do dockerfile
    if (dotenvConfig.error) {
        throw new Error('No dotenv file found');
    } else {
        const parsedEnv = dotenvConfig.parsed;

        for (const envVarKey in parsedEnv) {
            if (process.env[envVarKey] && envVarKey !== 'NODE_ENV') {
                let parsedValue = Number(process.env[envVarKey]);
                if (Number.isNaN(parsedValue)) {
                    parsedValue = process.env[envVarKey];
                }
                process.env[envVarKey] = parsedValue;
            }
        }
    }
}

if (!process.env.PORT) {
    throw `process env PORT is missing!`;
}

const indexPath = process.env.DOCKER
    ? path.resolve(__dirname, 'index.html')
    : path.resolve(__dirname, '..', 'build', 'index.html');

// static resources should just be served as they are
app.use(
    express.static(process.env.DOCKER ? path.resolve(__dirname) : path.resolve(__dirname, '..', 'build'), {
        maxAge: 0,
    }),
);

// here we serve the index.html page - https://create-react-app.dev/docs/deployment/#serving-apps-with-client-side-routing
app.get('/*', (req, res) => {
    fs.readFile(indexPath, 'utf8', async (error, htmlData) => {
        if (error) {
            // should not occur
            console.error('Error during file reading', error);
            return res.status(404).end();
        }

        return res.send(htmlData);
    });
});

const server = app.listen(Number(process.env.PORT), () => {
    const host = server.address().address;
    const port = server.address().port || ``;
    console.log(`App listening on: ${host}:${port}`);
});
