# Portfolio App 2 v0.5
Financial portfolio tracking system, built for personal use and for practice with full stack Javascript development.

## Features  
* View overall portfolio statistics  
* Compatible with stocks and crypto-currencies
* Receive scheduled email or text message notifications  
* Review portfolio value over time  
* Rank and view daily performance of each asset in your portfolio  

## How to Run 🏃‍ locally
*Ensure that `__API_URL__` is set to localhost inside `/public/js/app.js`*  
*Also setup all necessary environment variables.*

Basic setup: `npm install`  
Start server: `nodemon`  
Run db: `mongod`  
Deploy: `npm run deploy` 

## Reseeding database
Set local database back to original condition: `npm run seed`

## Exporting/backing up database
set environment variable for mongoUser and mongoPass, then: `npm run export`  
This will create file inside `/dbexport`

## Tech Stack   
**Model:**   
* MongoDB
* Mongoose

**View:**  
* Handlebars  

**Controller:**  
* Node.js
* Express.js

```
Seed instructions (for future future)
# Start mongo daemon
mongod
# open the mongo shell
mongo
# switch to your db, for example "portfolioApp"
> use mongoBlog
# load the seed.js file
> load('./dbseed/seed.js')
# check out the data you have!
> db.getCollectionNames()
```

## Debugging
To troubleshoot database, uncomment `mongoose.set('debug', true)` in app.js