
document.querySelector('#emailSettings .action').addEventListener('click', (e)=>{
    console.log("clicked email edit")
    emailEditMode();
})

let emailEditMode = (x) => {
    document.querySelector('#emailSettings .action').innerHTML = "Save";
    document.querySelector('#emailSettings .emailCell').innerHTML = `<input type="email" value="${"gregor.richardson@gmail.com"}">`; // set value from DB doc
    
    document.querySelector('#emailSettings .action').addEventListener('click', (e)=>{
        // validation
        // send content to update field
        emailViewMode();
    })
}

let emailViewMode = (x) => {
    document.querySelector('#emailSettings .action').innerHTML = "Change";
    document.querySelector('#emailSettings .emailCell').innerHTML = `${"gregor.richardson@gmail.com"}`; // set value from user DB doc
    document.querySelector('#textSettings .alert').innerHTML = ``;
    document.querySelector('#emailSettings .action').addEventListener('click', (e)=>{
        emailEditMode();
    })
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
    document.querySelector('#passwordSettings .passwordCell').innerHTML = `********`; //change to real new password length
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
    document.querySelector('#textSettings .textPhone').innerHTML = `<input type="text" value="">`; //set value from user DB doc
    document.querySelector('#textSettings .textCarrier').innerHTML = `<select><option value=${"@messaging.sprintpcs.com"}>Sprint</option></select>`; // get from DB

    document.querySelector('#textSettings .action').addEventListener('click', (e)=>{
        // validation
        // send content to update field
        textViewMode();
    })
}

let textViewMode = (x) => {
    document.querySelector('#textSettings .action').innerHTML = "Change";
    document.querySelector('#textSettings .textStatus').innerHTML = `${"On"}`; //change to real new text length
    document.querySelector('#textSettings .textFrequency').innerHTML = `${"Daily"}`; // get from DB
    document.querySelector('#textSettings .textPhone').innerHTML = `${"3059895420"}`; // get from DB
    document.querySelector('#textSettings .textCarrier').innerHTML = `${"Sprint"}`; // get from DB
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
    document.querySelector('#emailDeliverySettings .emailDeliveryStatus').innerHTML = `<select><option>On</option><option>Off</option></select>`; //set value from user DB doc
    document.querySelector('#emailDeliverySettings .emailDeliveryFrequency').innerHTML = `<select><option>Daily</option></select>`; //set value from user DB doc
    
    document.querySelector('#emailDeliverySettings .action').addEventListener('click', (e)=>{
        // validation
        // send content to update field
        emailDeliveryViewMode();
    })
}

let emailDeliveryViewMode = (x) => {
    document.querySelector('#emailDeliverySettings .action').innerHTML = "Change";
    document.querySelector('#emailDeliverySettings .emailDeliveryStatus').innerHTML = `${"On"}`; //change to real new emailDelivery length
    document.querySelector('#emailDeliverySettings .emailDeliveryFrequency').innerHTML = `${"Daily"}`; // get from DB
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