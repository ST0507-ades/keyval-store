const createHttpError = require('http-errors');
const { nanoid } = require('nanoid');
const { query, MYSQL_ERROR_CODE } = require('./database');

const TABLE_NAME = 'storage_tab';
module.exports.TABLE_NAME = TABLE_NAME;

const CREATE_TABLE_SQL = `
    CREATE TABLE ${TABLE_NAME} (
        id INT AUTO_INCREMENT primary key,
        k VARCHAR(255) unique not null,
        d VARCHAR(255) not null,
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
    return query(
        `
        INSERT INTO ${TABLE_NAME} (k, d, expire_on) VALUES(?, ?, ?);
    `,
        [key, JSON.stringify(data), expireOn],
    )
        .then(() => key)
        .catch((error) => {
            if (error.errno === MYSQL_ERROR_CODE.DUPLICATE_ENTRY) {
                throw createHttpError(400, `Key ${key} already exists`);
            } else throw error; // unexpected error
        });
};

module.exports.get = function get(key, now = getTimestampAfterNDays(0)) {
    return query(`SELECT d as 'data' FROM ${TABLE_NAME} where k = ? and expire_on > ?`, [key, now]).then((response) => {
        const rows = response[0];
        if (!rows.length) return null;
        return JSON.parse(rows[0].data);
    });
};
