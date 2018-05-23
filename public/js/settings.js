console.log("dataHolder",dataHolder);

// display on screen status message from server
let changeResponse = (response, target) => {
    document.querySelector(target).innerHTML = response.message;
    if (response.status == 200) document.querySelector(target).classList.add('good')

    setTimeout(() =>{
        document.querySelector(target).innerHTML = ``;
        if (response.status == 200) document.querySelector(target).classList.remove('good')
    }, 6000);
}

let emailValue, emailEdit = false; // emailEdit boolean determines if user can access view or edit mode

// flip emailEdit value to protect edit route
let toggleEmailEdit = (e)=>{
    e.preventDefault();
    emailEdit = !emailEdit;
    console.log("emailEdit toggle value", emailEdit)
    emailEdit === true ? emailEditMode() : emailViewMode();
    // document.querySelector('#emailSettings .action').removeEventListener('click', toggleEmailEdit); // not needed with {once}
}


// document.querySelector('#emailSettings .action').addEventListener('click', toggleEmailEdit, {once: true}); // always listen for action click

// Edit config & request
let emailEditMode = (x) => {
    if (emailEdit == true) {
        console.log("now in edit mode")
        document.querySelector('#emailSettings .action').addEventListener('click', toggleEmailEdit, {once: true}); // listen for action click
        
        // create edit fields
        document.querySelector('#emailSettings .action').innerHTML = "Save"; // change button text
        document.querySelector('#emailSettings .emailCell').innerHTML = `<input type="email" value="${dataHolder.email}">`; // set value from DB doc
        document.querySelector('#emailSettings .emailCell input').select();
        
        // initalize fields
        emailValue = document.querySelector('#emailSettings .emailCell input').value;
        
        // capture field input
        document.querySelector('#emailSettings .emailCell input').addEventListener('change', (e)=>{
            emailValue = document.querySelector('#emailSettings .emailCell input').value;
            console.log("New value typed", emailValue);
        })
        
        // send input in request
        let sendForm =()=> {

            let formData = {
                "email" : emailValue
            }
            
            console.log("this is formData",formData, JSON.stringify(formData));
            
            fetch(`/settings/update/email`, {
                method: 'PATCH',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(formData),
            })
            .then(response => response.json())
            .then(response => {
                console.log("direct response",response, response.email)
                dataHolder.email = response.email;
                changeResponse(response, `#emailSettings .alert`);
                emailEdit = false;
                console.log("email edit now false", emailEdit)
                // document.querySelector('#emailSettings .action.save').removeEventListener('click', sendForm)
                emailViewMode();
            });
        }
        document.querySelector('#emailSettings .action').classList.add('save');
        document.querySelector('#emailSettings .action.save').addEventListener('click',sendForm,{once: true}, false);
    } else console.log("I cant edit while emailedit is false")
}

let emailViewMode = (x) => {
    if (emailEdit == false) {
        console.log('now in view mode')
        document.querySelector('#emailSettings .action').addEventListener('click', toggleEmailEdit, {once: true}); // listen for action click
        if(document.querySelector('#emailSettings .action.save')) document.querySelector('#emailSettings .action.save').classList.remove('save');
        document.querySelector('#emailSettings .action').innerHTML = "Change";
        document.querySelector('#emailSettings .emailCell').innerHTML = `${dataHolder.email}`; // set value from user DB doc
        // document.querySelector('#emailSettings .emailCell').innerHTML = `${emailValue}`; // set value from local var for testing
        document.querySelector('#emailSettings .alert').innerHTML = ``;
    } else console.log("I cant view while emailedit is true")
}

let currentPassword,newPassword,newPasswordConfirm, passwordEdit = false;

let togglePasswordEdit = (e)=>{
    e.preventDefault();
    passwordEdit = !passwordEdit;
    console.log("passwordEdit toggle value", passwordEdit)
    passwordEdit === true ? passwordEditMode() : passwordViewMode();
    // document.querySelector('#passwordSettings .action').removeEventListener('click', togglePasswordEdit); // not needed with {once}
}

let passwordEditMode = (x) => {
    
    if (passwordEdit == true) {
        console.log("now in edit mode")
        document.querySelector('#passwordSettings .action').addEventListener('click', togglePasswordEdit, {once: true}); // listen for action click
        // document.querySelector('#passwordSettings .alert').innerHTML = `Everything's on fire.`
        
        // create edit fields
        document.querySelector('#passwordSettings .action').innerHTML = "Save";
        document.querySelector('#passwordSettings .passwordCell').innerHTML = `<input type="password" value="">`; // current password
        document.querySelector('#passwordSettings .passwordNewLabel').innerHTML = `New`;
        document.querySelector('#passwordSettings .passwordNewCell').innerHTML = `<input type="password" value="">`;
        document.querySelector('#passwordSettings .passwordConfirmCell').innerHTML = `<input type="password" value="">`;
        document.querySelector('#passwordSettings .passwordConfirmLabel').innerHTML = `Confirm`;
        document.querySelector('#passwordSettings .passwordCell input').select();
        
        // capture field input
        document.querySelector('#passwordSettings .passwordCell input').addEventListener('change', (e)=>{
            currentPassword = document.querySelector('#passwordSettings .passwordCell input').value;
            // console.log("New value typed", currentPassword);
        })
        document.querySelector('#passwordSettings .passwordNewCell input').addEventListener('change', (e)=>{
            newPassword = document.querySelector('#passwordSettings .passwordNewCell input').value;
            // console.log("New value typed", newPassword);
        })
        
        // send input in request
        let sendForm =()=> {

            let formData = {
                "currentPassword" : currentPassword,
                "newPassword" : newPassword
            }
            
            console.log("this is formData",formData, JSON.stringify(formData));
            
            fetch(`/settings/update/password`, {
                method: 'PATCH',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(formData),
            })
            .then(response => response.json())
            .then(response => {
                console.log("direct response",response, response.password)
                dataHolder.password = response.password;
                changeResponse(response, `#passwordSettings .alert`);
                passwordEdit = false;
                console.log("password edit now false", passwordEdit)
                // document.querySelector('#passwordSettings .action.save').removeEventListener('click', sendForm)
                passwordViewMode();
            });
        }
        document.querySelector('#passwordSettings .action').classList.add('save');
        document.querySelector('#passwordSettings .action.save').addEventListener('click',sendForm,{once: true}, false);
    } else console.log("I cant edit while passwordedit is false")
}

let passwordViewMode = (x) => {
    if (passwordEdit == false) {
        console.log('now in view mode')
        document.querySelector('#passwordSettings .action').addEventListener('click', togglePasswordEdit, {once: true}); // listen for action click
        if(document.querySelector('#passwordSettings .action.save')) document.querySelector('#passwordSettings .action.save').classList.remove('save');
        document.querySelector('#passwordSettings .action').innerHTML = "Change";
        document.querySelector('#passwordSettings .passwordCell').innerHTML = `**********`;
        document.querySelector('#passwordSettings .passwordConfirmLabel').innerHTML = ``;
        document.querySelector('#passwordSettings .passwordNewLabel').innerHTML = ``;
        document.querySelector('#passwordSettings .passwordNewCell').innerHTML = ``;
        document.querySelector('#passwordSettings .passwordConfirmCell').innerHTML = ``;
        document.querySelector('#textSettings .alert').innerHTML = ``;
    } else console.log("I cant view while passwordedit is true")
}

let textStatus, textFrequency, textPhone, textCarrier, textEdit = false;

let toggleTextEdit = (e)=>{
    e.preventDefault();
    textEdit = !textEdit;
    console.log("textEdit toggle value", textEdit);
    textEdit === true ? textEditMode() : textViewMode();
}


let textViewMode = (x) => {

    if (textEdit == false) {
        console.log('now in text view mode')
        document.querySelector('#textSettings .action').addEventListener('click', toggleTextEdit, {once: true}); // listen for action click
        if(document.querySelector('#textSettings .action.save')) document.querySelector('#textSettings .action.save').classList.remove('save');
        
        document.querySelector('#textSettings .action').innerHTML = "Change";
        document.querySelector('#textSettings .alert').innerHTML = ``;
        document.querySelector('#textSettings .action').innerHTML = "Change";
        
        dataHolder.textDelivery ? document.querySelector('#textSettings .textStatus').innerHTML = `${"On"}` : document.querySelector('#textSettings .textStatus').innerHTML = `${"Off"}`;

        if (dataHolder.textFrequency == 1) document.querySelector('#textSettings .textFrequency').innerHTML = `${"Daily"}`; 
        if (dataHolder.textFrequency == 7) document.querySelector('#textSettings .textFrequency').innerHTML = `${"Weekly"}`; 

        document.querySelector('#textSettings .textPhone').innerHTML = `${dataHolder.phone}`;
        
        if (dataHolder.carrier == "@txt.att.net") document.querySelector('#textSettings .textCarrier').innerHTML = `AT&T`;
        if (dataHolder.carrier == "@myboostmobile.com") document.querySelector('#textSettings .textCarrier').innerHTML = `Boost Mobile`;
        if (dataHolder.carrier == "@sms.mycricket.com") document.querySelector('#textSettings .textCarrier').innerHTML = `Cricket`;
        if (dataHolder.carrier == "@messaging.sprintpcs.com") document.querySelector('#textSettings .textCarrier').innerHTML = `Sprint`;
        if (dataHolder.carrier == "@tmomail.net") document.querySelector('#textSettings .textCarrier').innerHTML = `T-Mobile`;
        if (dataHolder.carrier == "@vmobl.com") document.querySelector('#textSettings .textCarrier').innerHTML = `Virgin Mobile`;

    } else console.log("I cant view while textedit is true")

}

let textEditMode = (x) => {
    document.querySelector('#textSettings .action').innerHTML = "Save";

    if (textEdit == true) {
        console.log('now in text edit mode')
        document.querySelector('#textSettings .action').addEventListener('click', toggleTextEdit, {once: true}); // listen for action click
        if(document.querySelector('#textSettings .action.save')) document.querySelector('#textSettings .action.save').classList.remove('save');
        document.querySelector('#textSettings .action').innerHTML = "Change";    
        document.querySelector('#textSettings .textStatus').innerHTML = `<select><option value="true">On</option><option value="false">Off</option></select>`; //set value from user DB doc
        document.querySelector('#textSettings .textFrequency').innerHTML = `<select><option value="1">Daily</option></select>`; //set value from user DB doc
        document.querySelector('#textSettings .textPhone').innerHTML = `<input type="text" value=${dataHolder.phone}>`; //set value from user DB doc
        document.querySelector('#textSettings .textCarrier').innerHTML = `
        <select id="carrier">
        <option value=""></option>
        <option value="@txt.att.net">AT&T</option>
        <option value="@myboostmobile.com">Boost Mobile</option>
        <option value="@sms.mycricket.com">Cricket</option>
        <option value="@messaging.sprintpcs.com">Sprint</option>
        <option value="@tmomail.net">T-Mobile</option>
        <option value="@vmobl.com">Virgin Mobile</option>
        </select>
        `; 
        document.querySelector('#textSettings .alert').innerHTML = ``;

        // set carrrier menu value
        document.querySelector('#textSettings .textCarrier select').value = dataHolder.carrier;
        document.querySelector('#textSettings .textStatus select').value = dataHolder.textDelivery;
        console.log("dataholder phone is",dataHolder.carrier);


        textStatus = document.querySelector('#textSettings .textStatus select').value;
        textFrequency = document.querySelector('#textSettings .textFrequency select').value;
        textPhone = document.querySelector('#textSettings .textPhone input').value;
        textCarrier = document.querySelector('#textSettings .textCarrier select').value;

        // capture field input
        document.querySelector('#textSettings .textStatus select').addEventListener('change', (e)=>{
            textStatus = document.querySelector('#textSettings .textStatus select').value;
        })
        
        document.querySelector('#textSettings .textFrequency select').addEventListener('change', (e)=>{
            textFrequency = document.querySelector('#textSettings .textFrequency select').value;
        })
        
        document.querySelector('#textSettings .textPhone input').addEventListener('change', (e)=>{
            textPhone = document.querySelector('#textSettings .textPhone input').value;
        })
        
        document.querySelector('#textSettings .textCarrier select').addEventListener('change', (e)=>{
            textCarrier = document.querySelector('#textSettings .textCarrier select').value;
        })
        
        // send input in request
        let sendForm =()=> {

            let formData = {
                "textStatus": textStatus,
                "textFrequency" : textFrequency,
                "textPhone" : textPhone,
                "textCarrier" : textCarrier
            }
            
            console.log("this is formData",formData, JSON.stringify(formData));
            
            fetch(`/settings/update/text`, {
                method: 'PATCH',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(formData),
            })
            .then(response => response.json())
            .then(response => {
                console.log("direct response",response)
                dataHolder.textDelivery = response.textStatus;
                dataHolder.carrier = response.carrier;
                dataHolder.phone = response.phone;
                changeResponse(response, `#textSettings .alert`);
                textEdit = false;
                console.log("text edit now false", textEdit)
                
                textViewMode();
            });
        }
        document.querySelector('#textSettings .action').classList.add('save');
        document.querySelector('#textSettings .action.save').addEventListener('click',sendForm,{once: true}, false);
    } else console.log("I cant edit while textedit is true")
    
}


let emailDeliveryValue, emailFrequency, emailDeliveryEdit = false;

let toggleEmailDeliveryEdit = (e)=>{
    e.preventDefault();
    emailDeliveryEdit = !emailDeliveryEdit;
    console.log("emailDeliveryEdit toggle value", emailDeliveryEdit)
    emailDeliveryEdit === true ? emailDeliveryEditMode() : emailDeliveryViewMode();
}

let emailDeliveryEditMode = (x) => {

    if (emailDeliveryEdit == true) {
        console.log("now in edit mode")
        document.querySelector('#emailDeliverySettings .action').addEventListener('click', toggleEmailDeliveryEdit, {once: true}); // listen for action click
        
        // create edit fields
        document.querySelector('#emailDeliverySettings .emailDeliveryStatus').innerHTML = `<select><option value="true">On</option><option value="false">Off</option></select>`;
        document.querySelector('#emailDeliverySettings .emailDeliveryFrequency').innerHTML = `<select><option value="1">Daily</option></select>`;
        document.querySelector('#emailDeliverySettings .action').innerHTML = "Save";

        // set emailDelivery menu values
        document.querySelector('#emailDeliverySettings .emailDeliveryStatus select').value = dataHolder.emailDelivery;
        document.querySelector('#emailDeliverySettings .emailDeliveryFrequency select').value = dataHolder.emailFrequency;
        
        // initalize fields
        emailDeliveryValue = document.querySelector('#emailDeliverySettings .emailDeliveryStatus select').value;
        emailFrequency = document.querySelector('#emailDeliverySettings .emailDeliveryFrequency select').value;
        
        // capture field input
        document.querySelector('#emailDeliverySettings .emailDeliveryStatus select').addEventListener('change', (e)=>{
            emailDeliveryValue = document.querySelector('#emailDeliverySettings .emailDeliveryStatus select').value;
            console.log("New value typed", emailDeliveryValue);
        })
        
        document.querySelector('#emailDeliverySettings .emailDeliveryFrequency select').addEventListener('change', (e)=>{
            emailFrequency = document.querySelector('#emailDeliverySettings .emailDeliveryFrequency select').value;
            console.log("New value typed", emailFrequency);
        })
        
        // send input in request
        let sendForm =()=> {

            let formData = {
                "emailDelivery" : emailDeliveryValue,
                "emailFrequency": emailFrequency
            }
            
            console.log("this is formData",formData, JSON.stringify(formData));
            
            fetch(`/settings/update/emailDelivery`, {
                method: 'PATCH',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(formData),
            })
            .then(response => response.json())
            .then(response => {
                console.log("direct response",response, response.email)
                dataHolder.emailDelivery = response.emailDelivery;
                dataHolder.emailFrequency = response.emailFrequency;
                changeResponse(response, `#emailDeliverySettings .alert`);
                emailEdit = false;
                console.log("email edit now false", emailEdit)
                // document.querySelector('#emailDeliverySettings .action.save').removeEventListener('click', sendForm)
                emailViewMode();
            });
        }
        document.querySelector('#emailDeliverySettings .action').classList.add('save');
        document.querySelector('#emailDeliverySettings .action.save').addEventListener('click',sendForm,{once: true}, false);
    } else console.log("I cant edit while emailDeliveryEdit is false")
}

let emailDeliveryViewMode = (x) => {
    if (emailDeliveryEdit == false) {
        console.log('now in view mode')
        document.querySelector('#emailDeliverySettings .action').addEventListener('click', toggleEmailDeliveryEdit, {once: true});
        if(document.querySelector('#emailDeliverySettings .action.save')) document.querySelector('#emailDeliverySettings .action.save').classList.remove('save');
        document.querySelector('#emailDeliverySettings .action').innerHTML = "Change";
        
        dataHolder.emailDelivery ? document.querySelector('#emailDeliverySettings .emailDeliveryStatus').innerHTML = `${"On"}` : document.querySelector('#emailDeliverySettings .emailDeliveryStatus').innerHTML = `${"Off"}`
    if (dataHolder.emailFrequency == 1) document.querySelector('#emailDeliverySettings .emailDeliveryFrequency').innerHTML = `${"Daily"}`;
    if (dataHolder.emailFrequency == 7) document.querySelector('#emailDeliverySettings .emailDeliveryFrequency').innerHTML = `${"Weekly"}`;
        document.querySelector('#emailDeliverySettings .alert').innerHTML = ``;
    } else console.log("I cant view while emailedit is true")
}


document.querySelector('#deleteAccountSettings .action').addEventListener('click', (e)=>{
    e.preventDefault();
    console.log("clicked deleteAccount edit")
    deleteAccountEditMode();
})

let deleteAccountEditMode = (x) => {
    document.querySelector('#deleteAccountSettings .action').innerHTML = "Save";
    document.querySelector('#deleteAccountSettings .deleteAccountStatus').innerHTML = `<select><option>Active</option><option>Disabled</option></select>`; 
    document.querySelector('#deleteAccountSettings .alert').innerHTML = `Warning: Disabled accounts cannot be reactivated`;
    
    document.querySelector('#deleteAccountSettings .action').addEventListener('click', (e)=>{
        // validation
        // send content to update field
        deleteAccountViewMode();
    })
}

let deleteAccountViewMode = (x) => {
    document.querySelector('#deleteAccountSettings .action').innerHTML = "Change";
    document.querySelector('#deleteAccountSettings .deleteAccountStatus').innerHTML = `${"Active"}`; //change to real new deleteAccount length
    document.querySelector('#deleteAccountSettings .alert').innerHTML = ``;

    document.querySelector('#deleteAccountSettings .action').addEventListener('click', (e)=>{
        deleteAccountEditMode();
    })
}



// call all view modes at load
emailViewMode(true);
passwordViewMode();
textViewMode();
emailDeliveryViewMode();
deleteAccountViewMode();
