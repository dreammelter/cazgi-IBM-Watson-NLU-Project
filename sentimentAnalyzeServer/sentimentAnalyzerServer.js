const express = require('express');
const app = new express();
const dotenv = require("dotenv");
dotenv.config();

function getNLUInstance() {
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;

    //stuff from the docs
    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1 ({
        version: '2021-03-25',
        authenticator: new IamAuthenticator({
            apikey: api_key
        }),
        serviceUrl: api_url
    });

    //this is a getter so return the thing we want pls
    return naturalLanguageUnderstanding;
}

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {
    let NLUProcessor = getNLUInstance()
    const analyzeParams = {
        'url': req.query.url,
        'features': {
            'emotion': {},
            'keywords': {
                'limit': 3,
                'emotion': true
            },
        'version': '2021-03-25',
        'limitTextCharacters': 250
        }
    }
    
    NLUProcessor.analyze(analyzeParams)
    .then(
        analysisResults => {
            console.log(JSON.stringify(analysisResults));
            return res.send(JSON.stringify(analysisResults));
        }
    )
    .catch(err => {
        console.log('Error: ', err);
    });
});

app.get("/url/sentiment", (req,res) => {
    return res.send("url sentiment for "+req.query.url);
});

app.get("/text/emotion", (req,res) => {
    return res.send(/* will be sending JSON i guess */);
});

app.get("/text/sentiment", (req,res) => {
    return res.send("text sentiment for "+req.query.text);
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

