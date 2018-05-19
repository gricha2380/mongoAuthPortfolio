console.log("current DB values", dataHolder)
let emailValue, emailEdit = false;

let changeResponse = (response, target) => {
    // console.log("here is response", response)
    document.querySelector(target).innerHTML = response.message;
    if (response.status == 200) document.querySelector(target).classList.add('good')

    setTimeout(() =>{
        document.querySelector(target).innerHTML = ``;
        if (response.status == 200) document.querySelector(target).classList.remove('good')
    }, 6000);
}

let toggleEdit = ()=>{
    // console.log('change button clicked. leaving view mode')
    emailEdit = !emailEdit;
    console.log("emailEdittoggle value", emailEdit)
    emailEdit = true ? emailEditMode() : emailViewMode();
    // document.querySelector('#emailSettings .action').removeEventListener('click', toggleEdit);
}

document.querySelector('#emailSettings .action').addEventListener('click', toggleEdit);

let emailEditMode = (x) => {
    if (emailEdit == true) {
        console.log("now in edit mode")
        document.querySelector('#emailSettings .action').innerHTML = "Save";
        // document.querySelector('#emailSettings .emailCell').innerHTML = `<input type="email" value="${emailValue}">`; // set value from local var for testing
        document.querySelector('#emailSettings .emailCell').innerHTML = `<input type="email" value="${dataHolder.email}">`; // set value from DB doc
        document.querySelector('#emailSettings .emailCell input').select();
        
        document.querySelector('#emailSettings .emailCell input').addEventListener('change', (e)=>{
            emailValue = document.querySelector('#emailSettings .emailCell input').value;
            console.log("New value typed", emailValue);
        })
        
        let sendForm =()=> {
            // field validation coming eventually
            let formData = {
                "email" : emailValue
            }
            
            console.log("this is formData",formData, JSON.stringify(formData));
            
            fetch(`/settings/update/email`, {
                method: 'PATCH',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(formData), // must match 'Content-Type' header
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
        document.querySelector('#emailSettings .action.save').addEventListener('click',sendForm,{once: true});
    } else console.log("I cant edit while emailedit is false")
}

let emailViewMode = (x) => {
    if (emailEdit == false) {
        console.log('now in view mode')
        if(document.querySelector('#emailSettings .action.save')) document.querySelector('#emailSettings .action.save').classList.remove('save');
        document.querySelector('#emailSettings .action').innerHTML = "Change";
        document.querySelector('#emailSettings .emailCell').innerHTML = `${dataHolder.email}`; // set value from user DB doc
        // document.querySelector('#emailSettings .emailCell').innerHTML = `${emailValue}`; // set value from local var for testing
        document.querySelector('#textSettings .alert').innerHTML = ``;
    } else console.log("I cant view while emailedit is true")
}


document.querySelector('#passwordSettings .action').addEventListener('click', (e)=>{
    console.log("clicked password edit")
    passwordEditMode();
})

let passwordEditMode = (x) => {
    document.querySelector('#passwordSettings .action').innerHTML = "Save";
    document.querySelector('#passwordSettings .passwordCell').innerHTML = `<input type="password" value="">`;
    document.querySelector('#passwordSettings .passwordNewCell').innerHTML = `<input type="password" value="">`;
    document.querySelector('#passwordSettings .passwordNewLabel').innerHTML = `New`;
    document.querySelector('#passwordSettings .passwordConfirmCell').innerHTML = `<input type="password" value="">`;
    document.querySelector('#passwordSettings .passwordConfirmLabel').innerHTML = `Confirm`;
    document.querySelector('#passwordSettings .alert').innerHTML = `Everything's on fire.`

    document.querySelector('#passwordSettings .action').addEventListener('click', (e)=>{
        // validation
        // send content to update field
        passwordViewMode();
    })
}

let passwordViewMode = (x) => {
    document.querySelector('#passwordSettings .action').innerHTML = "Change";
    document.querySelector('#passwordSettings .passwordCell').innerHTML = `********`; //change to real new password length?
    document.querySelector('#passwordSettings .passwordConfirmLabel').innerHTML = ``;
    document.querySelector('#passwordSettings .passwordNewLabel').innerHTML = ``;
    document.querySelector('#passwordSettings .passwordNewCell').innerHTML = ``;
    document.querySelector('#passwordSettings .passwordConfirmCell').innerHTML = ``;
    document.querySelector('#passwordSettings .alert').innerHTML = ``;

    document.querySelector('#passwordSettings .action').addEventListener('click', (e)=>{
        passwordEditMode();
    })
}


document.querySelector('#textSettings .action').addEventListener('click', (e)=>{
    console.log("clicked text edit")
    textEditMode();
})

let textEditMode = (x) => {
    document.querySelector('#textSettings .action').innerHTML = "Save";
    document.querySelector('#textSettings .textStatus').innerHTML = `<select><option>On</option><option>Off</option></select>`; //set value from user DB doc
    document.querySelector('#textSettings .textFrequency').innerHTML = `<select><option>Daily</option></select>`; //set value from user DB doc
    document.querySelector('#textSettings .textPhone').innerHTML = `<input type="text" value=${dataHolder.phone}>`; //set value from user DB doc
    document.querySelector('#textSettings .textCarrier').innerHTML = `<select><option value=${dataHolder.carrier}>Sprint</option></select>`; // get from DB

    document.querySelector('#textSettings .action').addEventListener('click', (e)=>{
        // validation
        // send content to update field
        textViewMode();
    })
}

let textViewMode = (x) => {
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

    document.querySelector('#textSettings .alert').innerHTML = ``;

    document.querySelector('#textSettings .action').addEventListener('click', (e)=>{
        textEditMode();
    })
}


document.querySelector('#emailDeliverySettings .action').addEventListener('click', (e)=>{
    console.log("clicked emailDelivery edit")
    emailDeliveryEditMode();
})

let emailDeliveryEditMode = (x) => {
    document.querySelector('#emailDeliverySettings .action').innerHTML = "Save";
    document.querySelector('#emailDeliverySettings .emailDeliveryStatus').innerHTML = `<select><option>On</option><option>Off</option></select>`; //set value from user DB doc ... conditional if existing setting is true then set on to selected. else set off to selected
    document.querySelector('#emailDeliverySettings .emailDeliveryFrequency').innerHTML = `<select><option>Daily</option></select>`; //set value from user DB doc
    
    document.querySelector('#emailDeliverySettings .action').addEventListener('click', (e)=>{
        // validation
        // send content to update field
        emailDeliveryViewMode();
    })
}

let emailDeliveryViewMode = (x) => {
    document.querySelector('#emailDeliverySettings .action').innerHTML = "Change";
    
    dataHolder.emailDelivery ? document.querySelector('#emailDeliverySettings .emailDeliveryStatus').innerHTML = `${"On"}` : document.querySelector('#emailDeliverySettings .emailDeliveryStatus').innerHTML = `${"Off"}`

    if (dataHolder.emailFrequency == 1) document.querySelector('#emailDeliverySettings .emailDeliveryFrequency').innerHTML = `${"Daily"}`;
    if (dataHolder.emailFrequency == 7) document.querySelector('#emailDeliverySettings .emailDeliveryFrequency').innerHTML = `${"Weekly"}`;
    document.querySelector('#emailDeliverySettings .alert').innerHTML = ``;

    document.querySelector('#emailDeliverySettings .action').addEventListener('click', (e)=>{
        emailDeliveryEditMode();
    })
}


document.querySelector('#deleteAccountSettings .action').addEventListener('click', (e)=>{
    console.log("clicked deleteAccount edit")
    deleteAccountEditMode();
})

let deleteAccountEditMode = (x) => {
    document.querySelector('#deleteAccountSettings .action').innerHTML = "Save";
    document.querySelector('#deleteAccountSettings .deleteAccountStatus').innerHTML = `<select><option>Active</option><option>Disabled</option></select>`; //set value from user DB doc
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
