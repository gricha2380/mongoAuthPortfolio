const firebaseApp = require('../helpers/db').firebaseApp;
let __USERID__ = require('../helpers/user').USERID; //log

let getSnapshots = () => {
    const ref = firebaseApp.database().ref(`users/${__USERID__}/snapshots`); //firebase database
    return ref.orderByChild('date').once('value').then(snap => {
        return snap.val()
    })
}

module.exports.getSnapshots = getSnapshots;