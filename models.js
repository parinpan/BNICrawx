'use strict'
var helper = require('./helpers.js')

class Category
{
	constructor(name, link)
	{
        this.name = name
        this.link = link
		this.promotions = []
        this.variable = helper.Filter.variable(name)
	}

    addPromotion(promotion)
    {
        this.promotions.push(promotion)
    }

    toString()
    {
        return this.variable
    }
}

class Merchant
{
	constructor(name, logo, address, contact)
    {
        this.name = name
        this.logo = logo
        this.address = address
        this.contact = contact
    }
}

class Promo
{
    constructor(link, title, validUntil)
    {
        this.link = link
        this.title = title
        this.validUntil = validUntil

        this.banner = null
        this.requisite = null
        this.merchant = new Merchant()
    }

    setBanner(banner)
    {
        this.banner = banner
    }

    setRequisite(requisite)
    {
        this.requisite = requisite
    }

    setMerchant(merchant)
    {
        this.merchant = merchant
    }
}

module.exports.Promo = Promo
module.exports.Merchant = Merchant
module.exports.Category = Category
