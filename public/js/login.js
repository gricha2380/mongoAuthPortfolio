'use strict';

var app = {};
var __API_URL__ = 'https://portfolioapp2380.herokuapp.com'; // deployed URL 
// var __API_URL__ = 'http://localhost:3000'; // local URL

(function(module) {
    let processLogin = (info) => {
        let myInit = { 
            method: 'POST',
            body: JSON.stringify(info), 
            credentials: 'include',
            headers: new Headers({
                'Content-Type': 'application/json'
                }),
            mode: 'cors',
            cache: 'default' };

        fetch(`${__API_URL__}/login`, myInit)
        .then(response => {
            if (response.status === 400) {
                console.log('incorrect username')
            } else if (response.status === 200) {
                console.log(`Fully authorized. Saving ${info.username} into localstorage`)
            }
            console.log(response.json());
        })
        .catch(error => console.error('Error:', error))
        .then(response => console.log('Success:', response));
    }
    
    let clearForm = () => {
        document.querySelector('#username').value = '';
        document.querySelector('#password').value = '';
    }
})(app);