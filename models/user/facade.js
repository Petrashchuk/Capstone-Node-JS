const Facade = require('../../utils/facade');

class UserFacade extends Facade {
    constructor() {
        super();
    }

    insertName = username => {
        const sql = `INSERT INTO Users(username) VALUES(?)`
        return this.db.run(sql, [username])
    }

    findUserByName = userName => this.db.get(`SELECT * FROM Users WHERE username = '${userName}'`)

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

    getAllExercises = async (userId, from = '1970-01-01', to = new Date().toISOString().slice(0, 10), limit) => {

        const request = limit ? this.db.all(`SELECT * FROM Exercises
                    WHERE userId = ${userId} AND date(date) BETWEEN '${from}' AND '${to}' LIMIT ${limit}
                    `) : this.db.all(`SELECT * FROM Exercises
                    WHERE userId = ${userId} AND date(date) BETWEEN '${from}' AND '${to}'
                    `);

        return {
            logs: await request,
            ...(await this.db.all(`SELECT COUNT(*) AS count FROM Exercises WHERE userId = ${userId} AND date(date) BETWEEN '${from}' AND '${to}' `))[0]
        }

    }
}

module.exports = new UserFacade();