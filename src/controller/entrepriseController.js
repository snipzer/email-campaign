import EntrepriseHandler from "../models/entrepriseHandler";
import _ from "underscore";
import HttpStatusService from "../services/httpStatusService";
import AuthenticityService from "../services/authenticityService";
let request = require('request');



export default class EntrepriseController {

    constructor() {
        this.entrepriseHandler = new EntrepriseHandler();
        this.httpStatusService = new HttpStatusService();
        this.authenticityService = new AuthenticityService();
    }

    index(req, res) {
        res.render('index');
    }

    register(req, res) {
        res.render('register');
    }

    login(req, res) {
        const that = this;
        const param = req.body;

        if (_.isNull(param.email) || _.isNull(param.password))
            that.sendJsonResponse(res, that.httpStatusService.internalServerError, {errMessage: "Information d'identification non reçus"});

        let array = {
            email: param.email,
            password: param.password
        };

        this.entrepriseHandler.login(array)
            .then(data => that.sendJsonResponse(res, that.httpStatusService.ok, data))
            .catch(err => that.sendJsonResponse(res, that.httpStatusService.internalServerError, err));
    }

    entreprise(req, res) {
        res.render('entreprise');
    }

    getEntreprises(req, res) {
        const that = this;
        this.entrepriseHandler.getEntreprises()
            .then(entreprises => that.sendJsonResponse(res, that.httpStatusService.ok, entreprises))
            .catch(err => that.sendJsonResponse(res, that.httpStatusService.internalServerError, err));
    }

    getEntrepriseById(req, res) {
        const that = this;
        if (_.isNull(req.params.id))
            that.sendJsonResponse(res, that.httpStatusService.internalServerError, {errMessage: "Parametre manquant"});
        const id = req.params.id;
        this.entrepriseHandler.getEntreprisesById(id)
            .then(entreprise => that.sendJsonResponse(res, that.httpStatusService.ok, entreprise))
            .catch(err => that.sendJsonResponse(res, that.httpStatusService.internalServerError, err));
    }

    postEntreprise(req, res) {
        const that = this;
        let array = this.setArrayFromBody(req.body);
        Object.entries(array).forEach(([key, value]) => {
            if (_.isNull(value))
                this.sendJsonResponse(res, that.httpStatusService.internalServerError, {errMessage: "Parametre manquant"});
        });
        this.entrepriseHandler.postEntreprise(array)
            .then(entreprise => that.sendJsonResponse(res, that.httpStatusService.ok, entreprise))
            .catch(err => that.sendJsonResponse(res, that.httpStatusService.internalServerError, err));

    }

    putEntreprises(req, res) {
        const that = this;
        if (_.isNull(req.params.id))
            that.sendJsonResponse(res, that.httpStatusService.internalServerError, {errMessage: "Parametre manquant"});
        const id = req.params.id;
        if (this.authenticityService.checkAuthenticity(req.decoded._id, id)) {
            let array = this.setArrayFromBody(req.body);
            this.entrepriseHandler.putEntreprise(id, array)
                .then(entreprise => that.sendJsonResponse(res, that.httpStatusService.ok, entreprise))
                .catch(err => that.sendJsonResponse(res, that.httpStatusService.internalServerError, err));
        }
        else {
            that.sendJsonResponse(res, that.httpStatusService.unauthorized, {errMessage: "Vous ne pouvez pas effectuer cette action"});
        }
    }

    deleteEntreprises(req, res) {
        const that = this;
        if (_.isNull(req.params.id))
            that.sendJsonResponse(res, that.httpStatusService.internalServerError, {errMessage: "Parametre manquant"});
        const id = req.params.id;
        if (this.authenticityService.checkAuthenticity(req.decoded._id, id)) {
            this.entrepriseHandler.deleteEntreprises(id)
                .then(entreprise => that.sendJsonResponse(res, that.httpStatusService.ok, entreprise))
                .catch(err => that.sendJsonResponse(res, that.httpStatusService.internalServerError, err));
        }
        else {
            that.sendJsonResponse(res, that.httpStatusService.unauthorized, {errMessage: "Vous ne pouvez pas effectuer cette action"})
        }
    }

    addCampaign(req, res) {
        const that = this;
        if (_.isNull(req.params.entrepriseId) || _.isNull(req.params.campaignId))
            that.sendJsonResponse(res, that.httpStatusService.internalServerError, {errMessage: "Parametre manquant"});
        const entrepriseId = req.params.entrepriseId;
        const campaignId = req.params.campaignId;
        if (this.authenticityService.checkAuthenticity(req.decoded._id, entrepriseId))
        {
            this.entrepriseHandler.addCampaign(entrepriseId, campaignId)
                .then(entreprises => that.sendJsonResponse(res, that.httpStatusService.ok, entreprises))
                .catch(err => that.sendJsonResponse(res, that.httpStatusService.internalServerError, err))
        }
        else {
            that.sendJsonResponse(res, that.httpStatusService.unauthorized, {errMessage: "Vous ne pouvez pas effectuer cette action"})
        }
    }

    removeCampaign(req, res) {
        const that = this;
        if (_.isNull(req.params.entrepriseId) || _.isNull(req.params.campaignId))
            that.sendJsonResponse(res, that.httpStatusService.internalServerError, {errMessage: "Parametre manquant"});
        const entrepriseId = req.params.entrepriseId;
        const campaignId = req.params.campaignId;
        if (this.authenticityService.checkAuthenticity(req.decoded._id, entrepriseId)) {
            this.entrepriseHandler.removeCampaign(entrepriseId, campaignId)
                .then(entreprise => that.sendJsonResponse(res, that.httpStatusService.ok, entreprise))
                .catch(err => that.sendJsonResponse(res, that.httpStatusService.internalServerError, err));
        }
        else {
            that.sendJsonResponse(res, that.httpStatusService.unauthorized, {errMessage: "Vous ne pouvez pas effectuer cette action"})
        }
    }

    getCampaigns(req, res) {
        request({
            uri: process.env.API_GET_CAMPAIGNS || "http://localhost:3000/mocking/campaigns",
        }).pipe(res);
    }

    sendJsonResponse(res, code, content) {
        res.status(code);
        res.json(content);
    }

    setArrayFromBody(body) {
        let array = {};
        array.label = (!_.isNull(body.label) && typeof body.label !== "undefined") ? body.label : null;
        array.email = (!_.isNull(body.email) && typeof body.email !== "undefined") ? body.email : null;
        array.password = (!_.isNull(body.password) && typeof body.password !== "undefined") ? body.password : null;
        array.url_ad = (!_.isNull(body.url_ad) && typeof body.url_ad !== "undefined") ? body.url_ad : null;
        array.url_picture = (!_.isNull(body.url_picture) && typeof body.url_picture !== "undefined") ? body.url_picture : null;
        return array
    }
}