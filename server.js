'use strict';

const Hapi = require('hapi');
const request = require('request');
const axios = require('axios');


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

const API_KEY = 'a8fqrjl63ciuvduiglp36r36o29nivj3qdjq542drrhpvt3t540';

const queryCompanies = (query, where) => {
    return axios.get(`https://societeinfo.com/app/rest/api/v1/querysearch/companies/json?query=${query}&where=${where}&limit=10&key=${API_KEY}`).then((response) => {    

        return response.data.result[0].registration_number;
    });
};

const getCompany = (registration_number) => {
    return axios.get(`https://societeinfo.com/app/rest/api/v1/company/json?registration_number=${registration_number}&key=${API_KEY}`).then((response) => {    

        return response.data.result.ape_code_level2;
    });
};

const getCodeNaf = async (query, where) => {
    const registration_number = await queryCompanies(query, where);
    const ape_code_level2 = await getCompany(registration_number);

    const slice_ape = ape_code_level2.slice(0, 1);

    return codenaf[slice_ape];
};

server.route({
    method: 'GET',
    path: '/',
    handler: async (req, h) => {

            console.log(req.query);

            const body = await getCodeNaf(req.query.query, req.query.where);

            return {value: body};

        }
});



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
