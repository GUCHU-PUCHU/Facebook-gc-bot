var google = require('googlethis');
var fse = require('fs-extra');
module.exports = {
	name: 'google',
	alias: ['g', 'gsearch', 'search'],
	args: true,
	adminOnly: false,
	GcOnly: true,
	usage: '<term>',
	description: 'Search for a term on Google.',
	info: 'Search for a term on Google.',
	cooldown: true,
	execute: async function (
		api: { sendMessage: (arg0: string, arg1: number) => void },
		message: { threadID: any; senderID: any },
		args: any[],
		utils: { sendMessage: (arg0: string, arg1: any, arg2: any, arg3: { limit: number }) => void }
	) {
		const query = args.join(' ');
		const options = {
			page: 0,
			safe: true,
			additional_params: {
				hl: 'en',
			},
		};
		const response = await google.search(query, options);
		// fse.ensureDirSync('./dist/data/google');
		// fse.writeJsonSync('./dist/data/google/' + message.senderID + '.json', response, { spaces: 4 });

		let x: any[] = [];
		if (response.dictionary) {
			x.push('*' + response.dictionary.word + '*');
			x.push(
				'Word: ' +
					response.dictionary.word +
					'\n' +
					'Definition:\n\t' +
					response.dictionary.definitions.join('\n') +
					'\n' +
					'Example:\n\t' +
					response.dictionary.examples.join('\n')
			);
			return api.sendMessage(x.join('\n'), message.threadID);
		}

		if (response.knowledge_panel.title !== 'N/A' && response.knowledge_panel.description !== 'N/A') {
			x.push('*' + response.knowledge_panel.title + '*');
			x.push(
				'Description: ' +
					response.knowledge_panel.description +
					'\n' +
					'URL: ' +
					response.knowledge_panel.url +
					'\n'
			);

			if (response.knowledge_panel.born) x.push('Born: ' + response.knowledge_panel.born);
			if (response.knowledge_panel.died) x.push('Died: ' + response.knowledge_panel.died);
			if (response.knowledge_panel.spouse) x.push(`Spouse: ${response.knowledge_panel.spouse}`);
			if (response.knowledge_panel.children) x.push(`Children: ${response.knowledge_panel.children}`);
			if (response.knowledge_panel.parents) x.push(`Parents: ${response.knowledge_panel.parents}`);
			return api.sendMessage(x.join('\n'), message.threadID);
		} else {
			x.push('*Results for ' + query + '*');
			for (let i = 0; response.results.length > i; i++) {
				x.push(
					'Title: ' +
						response.results[i].title +
						'\n' +
						'Description: ' +
						response.results[i].description +
						'\n' +
						'URL: ' +
						response.results[i].url +
						'\n'
				);
			}
			if (x.join('\n').length > 200) {
				api.sendMessage(
					'Too avoid huge block of text annoying everyone...\n' +
						'The results were sent to your DMs.\n' +
						'Kindly check them out.',
					message.threadID
				);
				return utils.sendMessage(x.join('\n'), api, message.senderID, { limit: 200 });
			}
			return api.sendMessage(x.join('\n'), message.threadID);
		}
	},
};
