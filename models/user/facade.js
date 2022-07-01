const Facade = require('../../utils/facade');

class UserFacade extends Facade {
    constructor() {
        super();
    }

    insert = data => {
        const sql = `INSERT INTO Users(username) VALUES(?)`
        return this.db.run(sql, [data.username])
    }

    getById = id => this.db.get(`SELECT * FROM Users WHERE id = ${id}`)

    getAll = () => this.db.all(`SELECT * FROM Users`)

    insertExercise = data => {
        const sql = `INSERT INTO Exercises(description,userId,duration,date) VALUES(?,?,?,?)`
        return this.db.run(sql, [data.description, +data.id, +data.duration, data.date])
    }

    getUserByIdExercise = (id, lastId) => {
        return this.db.get(`
                SELECT * FROM Users INNER JOIN Exercises
                     ON Exercises.userId = Users.id
                     WHERE Users.id = ${id} AND Exercises.id = ${lastId}
                `)
    }

    getAllExercises = (userId, from, to, limit) => {
        if (!(limit || to || from)) return this.db.all(`SELECT * FROM Exercises WHERE userId = ${userId}`)
        return this.db.all(`SELECT * FROM Exercises
                    WHERE userId = ${userId} AND date(date) BETWEEN '${from}' AND '${to}' LIMIT ${limit}
                    `)
    }
}

module.exports = new UserFacade();