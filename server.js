'use strict';

const Hapi = require('hapi');
const request = require('request');


// Create a server with a host and port
const server = Hapi.server({
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 3000
});

const codenaf = {
   
    "A": "Agriculture, sylviculture et pêche",
    "B": "Industries extractives",
    "C": "Industrie manufacturière",
    "D": "Production et distribution d'électricité, de gaz, de vapeur et d'air conditionné",
    "E":"Production et distribution d'eau ; assainissement, gestion des déchets et dépollution",
    "F": "Construction",
    "G": "Commerce ; réparation d'automobiles et de motocycles",
    "H": "Transports et entreposage",
    "I": "Hébergement et restauration",
    "J": "Information et communication",
    "K": "Activités financières et d'assurance",
    "L": "Activités immobilières",
    "M": "Activités spécialisées, scientifiques et techniques",
    "N": "Activités de services administratifs et de soutien",
    "O": "Administration publique",
    "P": "Enseignement",
    "Q": "Santé humaine et action sociale",
    "R": "Arts, spectacles et activités récréatives",
    "S": "Autres activités de services",
    "T": "Activités des ménages en tant qu'employeurs ; activités indifférenciées des ménages en tant que producteurs de biens et services pour usage propre",
    "U": "Activités extra-territoriales"
 };

// Add the route

server.route({
    method: 'GET',
    path: '/',
    handler: (req, h) => {

        //https://societeinfo.com/app/rest/api/v1/querysearch/companies/json?query=IDENTIQ&where=93100&limit=10&key=g4onk62np2m1a7q5co2engenbf3u3itbg3ggnfkbcfk6367sddp
        //https://societeinfo.com/app/rest/api/v1/company/json?registration_number=493361372&key=g4onk62np2m1a7q5co2engenbf3u3itbg3ggnfkbcfk6367sddp
        const body = await request('https://societeinfo.com/app/rest/api/v1/querysearch/companies/json?query=IDENTIQ&where=93100&limit=10&key=a8fqrjl63ciuvduiglp36r36o29nivj3qdjq542drrhpvt3t540', function (error, response, body) {
            
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            console.log('body:', body); // Print the HTML for the Google homepage.
            var obj = JSON.parse(body);
            var result = obj.result;
            var registration_number = result[0].registration_number;
            console.log(registration_number);
           

            request('https://societeinfo.com/app/rest/api/v1/company/json?registration_number='+registration_number+'&key=a8fqrjl63ciuvduiglp36r36o29nivj3qdjq542drrhpvt3t540', function (error, response, body) {
            
                console.log('error:', error); // Print the error if one occurred
                console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                console.log('body:', body); // Print the HTML for the Google homepage.
                var obj = JSON.parse(body);

                console.log(obj.result.ape_code_level2);

                var ape_code_level2 = obj.result.ape_code_level2.slice(0, 1);

                console.log(ape_code_level2);

                console.log(codenaf[ape_code_level2]);

                return codenaf[ape_code_level2];
                
            });

         });

        return body;


    }
})



// Start the server
async function start() {

    try {
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};

start();




// renvoie le code_ape_level2 à deux lettres
// renvoyer au code Naf 

/*

*/