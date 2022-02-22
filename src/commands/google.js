const google = require('googlethis');

module.exports = {
    name: 'google',
    description: 'Searches Google for a query',
    adminOnly: false,
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

        if (response.dictionary) {
            data.push("Dictionary");
            data.push(`Word: ${response.dictionary.word}`);
            data.push(`Phoenetic: ${response.dictionary.phonetic}`);
            data.push(`Audio: ${response.dictionary.audio}`);
            data.push(`\nDefinition: \n${response.dictionary.definitions.join('\n')}`);
            data.push(`\nExample: \n${response.dictionary.examples.join('\n')}`);
            return api.sendMessage(data.join('\n'), message.threadID);
        }

        if (response.knowledge_panel.title !== 'N/A') {
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
            data.push(`Title: ${response.results[0].title}`);
            data.push(`Link: ${response.results[0].url}`);
            data.push(`Description: ${response.results[0].description}`);
            api.sendMessage(data.join('\n'), message.threadID);
        }
    }
}