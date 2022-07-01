const statusCode = require('http-status-codes');
const queryString = require('query-string');

const Controller = require('../../utils/controller');
const UserFacade = require('./facade');


class UserController extends Controller {
    constructor(facade) {
        super(facade);
    }

    insert = async (req, res, next) => {
        try {
            const {lastID} = await this.facade.insert(req.body);
            res.status(statusCode.CREATED).json(await this.facade.getById(lastID))
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
            const data = {...req.body}
            if (!data.date) data.date = new Date().toISOString().slice(0, 10);
            const {lastID} = await this.facade.insertExercise(data);

            if (!data.description || !parseFloat(data.duration)) {
                return res.status(statusCode.BAD_REQUEST).json({message: 'fields description and duration are required '})
            }

            const {userId, duration, description, date} = await this.facade.getUserByIdExercise(data.id, lastID);
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
            const {params} = req.query
            const {from, to, limit} = queryString.parse(params);
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