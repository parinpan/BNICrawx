'use strict'
var fs = require('fs')
var request = require('request')

// classes
class Filter
{
   static variable(string)
   {
      return string.replace(/[^_a-zA-Z0-9]/g, '_').toLowerCase()
   }
}

class Config
{
   static get VERBOSE() { return true }
   static get SAVING_PATH_JSON() { return 'solution.json' }

	static get BASE_BNIPROMO_URL()
   {
		return 'https://m.bnizona.com/index.php/category/index/promo'
	}

	static get SELECTORS()
	{
		return {
			'category_link': '.menu li a',
			'promo': {
				'list': '#lists li',
				'link': 'a',
				'title': '.promo-title',
				'validUntil': '.valid-until',
				'banner': '#banner img',
				'requisite': '#merchant-detail p',
				'merchant': {
					'logo': 'img',
					'name': '.merchant-name',
					'address_contact': '#merchant-location .content p',
				},
			}
		}
   }
}

// functions
function MakeLog(message)
{
   if(Config.VERBOSE)
   {
      console.log(message)
   }
}

function Request(url, data, callback)
{
    return request(url, function(error, response, body)
    {
        if(!error && response.statusCode == 200)
        {
            return callback(body, data)
        }
    });
}

function MakeFile(promoResult)
{
   var json = JSON.stringify(promoResult, null, 2)

   fs.writeFile(Config.SAVING_PATH_JSON, json, function(err)
   {
      if(err)
      {
         throw err
      }

      MakeLog(Config.SAVING_PATH_JSON +  " is successfully saved.")
   });
}

// register modules
module.exports.MakeFile = MakeFile
module.exports.Request = Request
module.exports.MakeLog = MakeLog
module.exports.Filter = Filter
module.exports.Config = Config
