const createHttpError = require('http-errors');
const { nanoid } = require('nanoid');
const { query, POSTGRES_ERROR_CODE } = require('./database');

const TABLE_NAME = 'storage_tab';
module.exports.TABLE_NAME = TABLE_NAME;

const CREATE_TABLE_SQL = `
    CREATE TABLE ${TABLE_NAME} (
        id SERIAL primary key,
        key VARCHAR unique not null,
        data VARCHAR not null,
        expire_on INT not null
    );
`;
module.exports.CREATE_TABLE_SQL = CREATE_TABLE_SQL;

function getTimestampAfterNDays(n) {
    return Math.floor(new Date().getTime() / 1000) + n * 24 * 60 * 60;
}
module.exports.getTimestampAfterNDays = getTimestampAfterNDays;

module.exports.add = function add(data, key = nanoid(), expireAfterDays = 7) {
    const expireOn = getTimestampAfterNDays(expireAfterDays);
    return query(`INSERT INTO ${TABLE_NAME} (key, data, expire_on) VALUES($1, $2, $3) RETURNING key`, [
        key,
        JSON.stringify(data),
        expireOn,
    ])
        .then((response) => response.rows[0].key)
        .catch((error) => {
            if (error.code === POSTGRES_ERROR_CODE.UNIQUE_CONSTRAINT) {
                throw createHttpError(400, `Key ${key} already exists`);
            } else throw error; // unexpected error
        });
};

module.exports.get = function get(key, now = getTimestampAfterNDays(0)) {
    return query(`SELECT data FROM ${TABLE_NAME} where key = $1 and expire_on > $2`, [key, now]).then((result) => {
        if (!result.rows.length) return null;
        return JSON.parse(result.rows[0].data);
    });
};

module.exports.getAll = function getAll(lastId = 0, limit = 20, isExpired = 1) {
    const operator = +isExpired ? '<=' : '>';
    const now = getTimestampAfterNDays(0);
    return query(
        `
        SELECT * FROM ${TABLE_NAME}
        WHERE id > $1 AND expire_on ${operator} $2
        ORDER BY id
        LIMIT $3`,
        [lastId, now, limit],
    ).then((result) => result.rows);
};

module.exports.update = function update(key, expiryDate) {
    return query(`UPDATE ${TABLE_NAME} SET expire_on = $1 where key = $2`, [expiryDate, key]).then((result) => {
        if (!result.rowCount) throw createHttpError(404, `Key ${key} not found!`);
    });
};
