import path from 'path';
import _ from 'underscore';
import express from 'express';
import bodyParser from 'body-parser';
import EntrepriseController from './controller/entrepriseController';
import MockingService from './services/mockingService';
import AccessGranted from './middleware/accessGranted';


export default class Server {
    constructor()
    {
        this._app = express();

        this._app.use(express.static(path.join(__dirname, '/../public')));


        this._app.use(bodyParser.json());
        this._app.use(bodyParser.urlencoded({extended: true}));


        this._app.set('view engine', 'twig');
        this._app.set('views', path.join(__dirname, '../src/views/'));
    }

    setPort(port)
    {
        if (_.isEmpty(port))
        {
            port = 3000;
        }

        this.port = port;
    }


    // todo -> put 'api/v1' to config file
    _initControllers()
    {
        const entrepriseController = new EntrepriseController();
        const mockingService = new MockingService();
        const accessGranted = new AccessGranted();

        this._app.get('/', accessGranted.public, entrepriseController.index.bind(entrepriseController));
        this._app.get('/entreprise', accessGranted.restricted, entrepriseController.entreprise.bind(entrepriseController));
        
        /** Route temporaire **/
        this._app.get('/mock/campaigns', accessGranted.public, mockingService.generateCampaigns.bind(mockingService));

        /**
         * @api {get} /v1/entreprises 1 Get all entreprises
         * @apiName GetEntreprises
         * @apiGroup entreprise
         *
         * @apiSuccess {Array[]} array List of kittens
         * @apiSuccess {Object} array.kittens Detail of a kitten
         * @apiSuccess {String} array.kittens.id The kitten id is 24 character length auto-generated by mongoDB
         * @apiSuccess {String} array.kittens.name The name of the kitten, is required and should be unique
         * @apiSuccess {String} array.kittens.color The color of the kitten, is required
         * @apiSuccess {String} array.kittens.primaryQuality The primary quality of the kitten, is required
         * @apiSuccess {String} array.kittens.secondQuality The second quality of the kitten, is optionnal
         * @apiSuccess {String} array.kittens.primaryDefault The primary default of the kitten, is required
         * @apiSuccess {String} array.kittens.kibbles The prefered brand of kibbles for the kitten
         * @apiSuccess {Boolean} array.kittens.isAvailable Is the kitten already adopted or not
         */

        this._app.post('/api/v1/login', accessGranted.public, entrepriseController.login.bind(entrepriseController));
        this._app.get('/api/v1/entreprises', accessGranted.restricted, entrepriseController.getEntreprises.bind(entrepriseController));
        this._app.get('/api/v1/entreprises/:id', accessGranted.restricted, entrepriseController.getEntrepriseById.bind(entrepriseController));
        this._app.post('/api/v1/entreprises', accessGranted.restricted, entrepriseController.postEntreprise.bind(entrepriseController));
        this._app.put('/api/v1/entreprises/:id', accessGranted.restricted, entrepriseController.putEntreprises.bind(entrepriseController));
        this._app.delete('/api/v1/entreprises/:id', accessGranted.restricted, entrepriseController.deleteEntreprises.bind(entrepriseController));
        this._app.put('/api/v1/entreprises/:entrepriseId/:campaignId/add', accessGranted.restricted, entrepriseController.addCampaign.bind(entrepriseController));
        this._app.put('/api/v1/entreprises/:entrepriseId/:campaignId/remove', accessGranted.restricted, entrepriseController.removeCampaign.bind(entrepriseController));
    }

    run()
    {
        this._initControllers();

        this._app.listen(this.port, () => console.log(`Server listening on port ${this.port}!`));
    }
}