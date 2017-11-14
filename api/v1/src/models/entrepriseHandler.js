import entrepriseModel from "./entrepriseModel";
import _ from "underscore";


export default class entrepriseHandler {
    constructor()
    {
        this.EntrepriseModel = entrepriseModel;
    }

    getEntreprises()
    {
        return new Promise((resolve, reject) =>
        {
            this.EntrepriseModel.find({})
                .then(entreprises => resolve(entreprises))
                .catch(err => reject(err));
        });
    }

    getEntreprisesById(id)
    {
        return new Promise((resolve, reject) =>
        {
            this.EntrepriseModel.find({"_id": id})
                .then(entreprises => resolve(entreprises))
                .catch(err => reject(err));
        });
    }

    // TODO Hasher le mot de passe
    putEntreprise(id, array)
    {
        return new Promise((resolve, reject) =>
        {
            this.getEntrepriseById(id).then(entreprise =>
            {
                let modifiedEntreprise = this.checkArrayAndModifyEntreprise(entreprise, array);
                modifiedEntreprise.save();
                resolve(modifiedEntreprise);
            }).catch(err => reject(err));
        })
    }

    deleteEntreprises(id)
    {
        // Return promise
    }

    removeCampaign(entrepriseId, campaignId)
    {
        // Return promise
    }

    addCampaign(entrepriseId, campaignId)
    {
        // Return promise
    }

    private static checkArrayAndModifyEntreprise(entreprise, array) {
        if (!_.isNull(array.email))
            entreprise.email = array.email;

        if (!_.isNull(array.label))
            entreprise.label = array.label;

        if (!_.isNull(array.password))
            entreprise.password = array.password;

        if (!_.isNull(array.url_ad))
            entreprise.url_ad = array.url_ad;

        if (!_.isNull(array.url_picture))
            entreprise.url_picture = array.url_picture;

        if (!_.isNull(array.campaign))
            entreprise.campaign = array.campaign;

        return entreprise;
    }
}