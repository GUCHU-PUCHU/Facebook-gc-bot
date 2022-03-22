var google = require('googlethis');
var utils = require('../utils');

module.exports = {
    name: 'google',
    description: 'Searches Google for a query',
    adminOnly: false,
	args: false,
    hidden: false,
    cooldown: true,
    async execute(api, message, args) {
        const query = args.join(' ');
        if (!query) {
            api.sendMessage('Please enter a query!', message.threadID);
            return;
        }

        const options = {
            page: 0,
            safe: true,
            additional_params: {
                hl: 'en'
            }
        }
        const response = await google.search(query, options);

        let data = [];
		console.log(response);

        if (response.dictionary) {
            data.push("Dictionary");
            data.push(`Word: ${response.dictionary.word}`);
            data.push(`Phoenetic: ${response.dictionary.phonetic}`);
            data.push(`Audio: ${response.dictionary.audio}`);
            data.push(`\nDefinition: \n${response.dictionary.definitions.join('\n')}`);
            data.push(`\nExample: \n${response.dictionary.examples.join('\n')}`);
            return api.sendMessage(data.join('\n'), message.threadID);
        }

        if (response.knowledge_panel.title !== 'N/A' && response.knowledge_panel.description !== 'N/A') {
            data.push("Knowledge Panel");
            data.push(`Title: ${response.knowledge_panel.title}`);
            data.push(`Description: ${response.knowledge_panel.description}`);
            data.push(`Link: ${response.knowledge_panel.url}`);
            if (response.knowledge_panel.born) data.push(`Born: ${response.knowledge_panel.born}`);
            if (response.knowledge_panel.died) data.push(`Died: ${response.knowledge_panel.died}`);
            if (response.knowledge_panel.spouse) data.push(`Spouse: ${response.knowledge_panel.spouse}`);
            if (response.knowledge_panel.children) data.push(`Children: ${response.knowledge_panel.children}`);
            if (response.knowledge_panel.parents) data.push(`Parents: ${response.knowledge_panel.parents}`);

            return api.sendMessage(data.join('\n'), message.threadID);
        }

        else {
			data.push(`Results for "${query}"`);
			for (let i = 0; i < response.results.length; i++) {
				data.push(`${i + 1}. ${response.results[i].title}`);
				data.push(`Description: \n	${response.results[i].description}\n`);
				data.push(`Link: ${response.results[i].url}`);
				data.push(`\n`);
			}

			// check number of characters
			if (data.join('\n').length > 500) {
				api.sendMessage('To avoid a massive block of message annoying everyone the results was sent to your DMs.', message.threadID);
				utils.splitMessage(data.join('\n'), 2000).forEach(msg => {
					api.sendMessage(msg, message.senderID);
					utils.sleep(2000);
				});
			}
			else {
				api.sendMessage(data.join('\n'), message.threadID);
			}
           
        }
    }
}

// tbh there's a better way to code this but I'm being lazy asf