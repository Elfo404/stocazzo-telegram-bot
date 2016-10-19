const TelegramBot = require('node-telegram-bot-api');
const request = require("request").defaults({
	baseUrl: "http://stocazzo.io/"
});

const token = require('./token');
const bot = new TelegramBot(token, { polling: true });

bot.onText(/(big\s)?(_|ascii\s)?(chi\s*\?)$/i, function (msg, match) {
	request(buildURL(match),  (error, response, body) =>{
		if (!error && response.statusCode == 200) {
			let stocazzo = JSON.parse(body);
			bot.sendMessage(msg.chat.id, stocazzo.response);
		}
	});
});


function buildURL(match){
	let modifier=match[1],
		variant=match[2],
		query=match[3];

	let url='/';
	if(query.isUpperCase()){
		url+='caps'
	}else if(query.indexOf('Chi?')>=0){
		url+='camel';
	}else if(variant=='ascii '){
		url+='ascii';
	}else if(variant=='_'){
		url+='underscore';
	}

	url+='?q='+match.input;

	if(modifier){
		url+='&big=1';
	}

	return url;
}


String.prototype.isUpperCase = function() {
	return this.valueOf().toUpperCase() === this.valueOf();
};
