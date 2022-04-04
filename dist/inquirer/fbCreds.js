"use strict";
// askFbCreds: function () {
// 	inquirer
// 		.prompt([
// 			{
// 				type: 'input',
// 				name: 'email',
// 				message: 'What is your email?',
// 				validate: this.checkIfEmail,
// 			},
// 			{
// 				type: 'password',
// 				name: 'password',
// 				message: 'What is your password?',
// 				mask: '*',
// 				validate: this.checkIfEmpty,
// 			},
// 		])
// 		.then((answers: { email: any; password: any }) => {
// 			var email = answers.email;
// 			var password = answers.password;
// 			this.fetchCookies(email, password);
// 		});
// },
var inquirer = require('inquirer');
var path = require('path');
(async () => {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'email',
            message: 'What is your email?',
            validate: function (email) {
                var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(String(email).toLowerCase());
            },
        },
        {
            type: 'password',
            name: 'password',
            message: 'What is your password?',
            mask: '*',
            validate: function (password) {
                return password.length > 0;
            },
        },
    ]);
    var email = answers.email;
    var password = answers.password;
    require('./fetchCookies')(email, password);
    require(path.join(__dirname, '../index'));
})();
