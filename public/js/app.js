'use strict';

var app = {};
var __API_URL__ = 'https://portfolioapp2380.herokuapp.com'; // deployed URL
// var __API_URL__ = 'http://localhost:3000'; // local URL

let chartPoints = [];
let exchangePoints = [];
let assets = [];
let none = {'neg':Number.NEGATIVE_INFINITY,'pos':Number.POSITIVE_INFINITY};
initUserMenu()
function initUserMenu(){
    console.log('working')
    document.querySelector('#userName').addEventListener('click', function(event){
        event.preventDefault(); // stop button standard action
        console.log('You clicked user menu',this.id);
        expandMenu(this.id); //pass id to menu function
    });

    document.querySelector('#sendEmail').addEventListener('click',function(event){
        document.querySelector('.dropdownList.show').classList.remove('show');
        if (document.querySelector('.container')) {document.querySelector('.container').classList.remove('dim')}

        let myInit = { method: 'POST',
                    body: '', 
                    credentials: 'include',
                    headers: new Headers({'Content-Type': 'application/json'}),
                    mode: 'cors',
                    cache: 'default'};

        fetch(`${__API_URL__}/email/send`, myInit)
        .then(response => {
            console.log('email response...')
            if (response.status === 401) {
                console.log('failure')
            } else if (response.status === 200) {
                console.log(`Email sent sucessfully`)
            }
            console.log(response.json());

        })
        // .then(response => {console.log(response.status,'status is this');response.json()})
        .catch(error => console.error('Error:', error))
        .then(response => console.log('Success:', response));
    });

    document.querySelector('#sendText').addEventListener('click',function(event){
        console.log(this.id,'id here');
        document.querySelector('.dropdownList.show').classList.remove('show');
        if (document.querySelector('.container')) {document.querySelector('.container').classList.remove('dim')}

        let myInit = { method: 'POST',
                    body: '', 
                    credentials: 'include',
                    headers: new Headers({'Content-Type': 'application/json'}),
                    mode: 'cors',
                    cache: 'default'};

        fetch(`${__API_URL__}/text/send`, myInit)
        .then(response => {
            console.log('text response...')
            if (response.status === 401) {
                console.log('failure')
            } else if (response.status === 242) {
                console.log(`text sent sucessfully`)
            }
            console.log(response.json());

        })
        // .then(response => {console.log(response.status,'status is this');response.json()})
        .catch(error => console.error('Error:', error))
        .then(response => console.log('Success:', response));
    });

    document.querySelector('#about').addEventListener('click', function(event){
        document.querySelector('.dropdownList').classList.remove('show');
        let modalBox = document.createElement('div');
        modalBox.setAttribute("id", "aboutModal");
        modalBox.setAttribute("class", "modal");
        modalBox.innerHTML = 
            `
            <div class="inner">
            <div class="modalTitle center">Portfolio App <span class="minor">2380</span></div>
            <div>
            <div class="madeBy center">Made by Gregor Richardson</div>
            </div>
            <div><a href="https://github.com/gricha2380/portfolioApp2380" target="_blank">Source Code</a></div>
            <div><a href="http://gregorrichardson.com/blog/portfolio-app-v2/" target="_blank">Blog Post</a></div>
            </div>
            `;
        modalBox.querySelector('.inner').innerHTML += 
        `<div class="buttonHolder">
            <div class="primary button save close" id="close">Okay</div>
        </div>`;
        
        document.querySelector("body").append(modalBox);
        let item = document.querySelector('#aboutModal');
        item.addEventListener('click',function(event){
            if (event.target.matches('div.close')) {
                console.log('clicked')
                item.remove();
            } 
        });

    })

     // when button is clicked, toggle visibility of menu items.
     let expandMenu = (target) => {
    
        // change CSS visibility for specified menu ID
        document.querySelector('#'+target+'+.dropdownList').classList.toggle('show');

        // astetic background blue
        if (document.querySelector('.container')) {document.querySelector('.container').classList.toggle('dim')}

        // hide menu if anything other than button is clicked
        document.querySelector('body').addEventListener('click', function(event){
            // if topic menu exists on page...
            if (document.querySelector('#'+target+'+ .dropdownList')) {
                // if target isn't a button turn off show CSS class
                if (!event.target.matches('.menu')) {
                    document.querySelector('#'+target+'+ .dropdownList').classList.remove('show');
                    if (document.querySelector('.container')) {document.querySelector('.container').classList.remove('dim')}
                }
            }
        });
    } // end expandMenu
}

(function(module) {

    let refresh = document.querySelector('.refresh');
    if (refresh) {
        refresh.addEventListener('click', e => {
            // I need to write a real refresh function someday...
            location.reload();
        })
    }

})(app);