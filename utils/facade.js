const Database = require("sqlite-async");

class Facade {
    #db
    constructor() {
        this.#createDb().then(db => {
            this.#createTables(db);
            this.#db = db;
        })
    }

    get db(){
        return this.#db;
    }

    async #createDb (){
            return Database.open('test.db');

    }

    #createTables(db) {
        db.run(`CREATE TABLE IF NOT EXISTS Users (id INTEGER PRIMARY KEY ASC, username)`);
        db.run(`CREATE TABLE IF NOT EXISTS Exercises (
            id INTEGER PRIMARY KEY ASC, 
             description TEXT,
             userId INTEGER,
             duration INTEGER,
             date TEXT,
            
             FOREIGN KEY (userId) REFERENCES Users(id)
           )`);
    }
}


module.exports = Facade;