const statusCode = require('http-status-codes');
const moment = require("moment/moment");

const Controller = require('../../utils/controller');
const UserFacade = require('./facade');


class UserController extends Controller {
    constructor(facade) {
        super(facade);
    }

    insert = async (req, res, next) => {
        try {
            if (req.body.username) {
                const {lastID} = await this.facade.insert(req.body);
                res.status(statusCode.CREATED).json(await this.facade.getById(lastID))
            } else next({statusCode: statusCode.BAD_REQUEST, message: 'please type username'})
        } catch (e) {
            next({statusCode: statusCode.INTERNAL_SERVER_ERROR, message: e.message})
        }

    }

    getAll = async (req, res, next) => {
        try {
            const response = await this.facade.getAll();
            res.status(response.length ? statusCode.OK : statusCode.NOT_FOUND).json(response);
        } catch (e) {
            next({statusCode: statusCode.INTERNAL_SERVER_ERROR, message: e.message})
        }

    }

    insertExercise = async (req, res, next) => {
        try {

            const {id} = req.params;

            if (!await this.facade.getById(id)) {
                return next({statusCode: statusCode.NOT_FOUND, message: "User doesn't exist"})
            }

            const data = {...req.body, id};

            if (!data.date) data.date = data.date = moment().format('YYYY-MM-DD');
            else if (!moment(data.date, 'YYYY-MM-DD', true).isValid()) {
                return next({statusCode: statusCode.BAD_REQUEST, message: 'date format is incorrect'})
            }


            if (!data.description || !parseFloat(data.duration)) {
                return next({statusCode: statusCode.BAD_REQUEST, message: 'fields description and duration are required'})
            }

            const {lastID} = await this.facade.insertExercise(data);

            const {userId, duration, description, date} = await this.facade.getUserByIdExercise(id, lastID);
            res.status(statusCode.CREATED).json({
                userId,
                exerciseId: lastID,
                duration,
                description,
                date
            })
        } catch (e) {
            next({statusCode: statusCode.INTERNAL_SERVER_ERROR, message: e.message})
        }

    }

    getLogs = async (req, res, next) => {
        try {
            const {id} = req.params
            const {from, to, limit} = req.query
            const result = await this.facade.getAllExercises(id, from, to, limit);

            res.status(statusCode.OK).json({
                count: result.length,
                logs: result
            })
        } catch (e) {
            next({statusCode: statusCode.INTERNAL_SERVER_ERROR, message: e.message})
        }


    }
}

module.exports = new UserController(UserFacade);