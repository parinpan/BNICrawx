/*
	Written by: M. Fachrin Aulia Nasution
	Email	  : fachrinfan@gmail.com
	Notes	  : I don't use promise.js (bluebird) to handle parallel asychronous
				because I can utilize request library to do the same.
*/

// define libraries
cheerio = require('cheerio')
model = require('./models.js')
helper = require('./helpers.js')

// callback stuff
TOTAL_LINKS = 0
PROMO_RESULT = {}

function savePromo(categoryObj)
{
	if(TOTAL_LINKS == 0)
	{
		helper.MakeFile(PROMO_RESULT)
		return
	}

	if(!PROMO_RESULT.hasOwnProperty(categoryObj))
	{
		PROMO_RESULT[categoryObj] = {
			'name': categoryObj.name,
			'link': categoryObj.link
		}
	}

	PROMO_RESULT[categoryObj]['promotions'] = categoryObj.promotions
}

// main program to start collect categories
helper.Request(helper.Config.BASE_BNIPROMO_URL, {}, function(categoryBody)
{
	$ = cheerio.load(categoryBody)
	selector = helper.Config.SELECTORS

	$(selector['category_link']).each(function(x, link)
	{
		categoryLink = $(link).attr('href')

		// enter each category to crawl each promos
		helper.Request(categoryLink, {
			'name': $(link).text(),
			'link': categoryLink
		}, function(promoBody, category)
		{
			pSelect = selector['promo']  // promo selector
			mSelect = pSelect['merchant']  // merchant selector

			category = new model.Category(
				category['name'].trim(),
				category['link']
			)

			_$ = cheerio.load(promoBody)
			TOTAL_LINKS += _$(pSelect['list']).length

			_$(pSelect['list']).each(function(y, list)
			{
				promo = new model.Promo(
					_$(list).find(pSelect['link']).attr('href'),
					_$(list).find(pSelect['title']).text(),
					_$(list).find(pSelect['validUntil']).text()
				)

				// collect the promo content and register it to json list
				helper.Request(promo.link, {
					'promo': promo,
					'category': category,
					'merchant': {
						'name': $(list).find(mSelect['name']).text().trim(),
						'logo': $(list).find(mSelect['logo']).attr('src')
					}
				}, function(contentBody, data)
				{
					TOTAL_LINKS -= 1
					__$ = cheerio.load(contentBody)

					merchant = new model.Merchant(
						data['merchant']['name'].trim(),
						data['merchant']['logo'],
						__$(mSelect['address_contact']).first().text(),
						__$(mSelect['address_contact']).first().next('p').text()
					)

					data['promo'].setRequisite(__$(pSelect['requisite']).text())
					data['promo'].setBanner(__$(pSelect['banner']).attr('src'))
					data['promo'].setMerchant(merchant)

					helper.MakeLog('Saving: ' + data['promo'].link)
					data['category'].addPromotion(data['promo'])
					savePromo(data['category'])
				})
			})
		})
	})
})
