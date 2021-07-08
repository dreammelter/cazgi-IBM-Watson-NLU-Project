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
            apikey: api_key,
        }),
        serviceUrl: api_url,
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
    let NLUProcessor = getNLUInstance();
    let UrltoProcess = req.query.url;
    console.log("URL to Process: "+UrltoProcess);

    const analyzeParams = {
        'url': UrltoProcess,
        'features': {
            'emotion': {
                'document': true
            },
            /*'keywords': {
                'limit': 3,
                'emotion': true
            },
        //'version': '2021-03-25',
        //'limitTextCharacters': 250*/
        }
    }
    
    console.log("Gonna try analyzing it now...")
    NLUProcessor.analyze(analyzeParams)
    .then(
        analysisResults => {
            console.log(JSON.stringify(analysisResults));
            //return res.send('We made it back - check console!');
            return res.send(analysisResults.result.emotion.document.emotion);
        }
    )
    .catch(err => {
        console.log('Welp - there was an error:', err);
        return res.send('There was an error. :(')
    });
    //return res.send('testing these data types and formats...');
});

app.get("/url/sentiment", (req,res) => {
    let NLUProcessor = getNLUInstance();
    let UrltoProcess = req.query.url;
    console.log("URL to Process: "+UrltoProcess);

    const analyzeParams = {
        'url': UrltoProcess,
        'features': {
            'sentiment': {
                'document': true
            },
        }
    }
    
    console.log("Gonna try analyzing it now...")
    NLUProcessor.analyze(analyzeParams)
    .then(
        analysisResults => {
            console.log(JSON.stringify(analysisResults));
            //return res.send('We made it back - check console!');
            return res.send('Sentiment for URL: '+analysisResults.result.sentiment.document.label);
        }
    )
    .catch(err => {
        console.log('Welp - there was an error:', err);
        return res.send('There was an error. :(')
    });
});

app.get("/text/emotion", (req,res) => {
    let NLUProcessor = getNLUInstance();
    let TxttoProcess = req.query.text;

    const analyzeParams = {
        'text': TxttoProcess,
        'features': {
            'emotion': {},
        },
        'limitTextCharacters': 250,
    }
    
    console.log("Gonna try analyzing it now...")
    NLUProcessor.analyze(analyzeParams)
    .then(
        analysisResults => {
            console.log(JSON.stringify(analysisResults));
            //return res.send('We made it back - check console!');
            return res.send(analysisResults.result.emotion.document.emotion);
        }
    )
    .catch(err => {
        console.log('Welp - there was an error:', err);
        return res.send('There was an error. :(')
    });
});

app.get("/text/sentiment", (req,res) => {
    let NLUProcessor = getNLUInstance();
    let TxttoProcess = req.query.text;

    const analyzeParams = {
        'text': TxttoProcess,
        'features': {
            'sentiment': {},
        },
        'limitTextCharacters': 250,
    }
    
    console.log("Gonna try analyzing it now...")
    NLUProcessor.analyze(analyzeParams)
    .then(
        analysisResults => {
            console.log(JSON.stringify(analysisResults));
            //return res.send('We made it back - check console!');
            return res.send("Sentiment for text: "+analysisResults.result.sentiment.document.label);
        }
    )
    .catch(err => {
        console.log('Welp - there was an error:', err);
        return res.send('There was an error. :(')
    });
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

