/* eslint-disable no-console */
const database = require('../database');
const storage = require('../storage');

database
    .query(
        `
    DROP TABLE IF EXISTS ${storage.TABLE_NAME};
    ${storage.CREATE_TABLE_SQL}
    `,
    )
    .then(() => {
        console.log('Successfully created!');
    })
    .catch((error) => {
        console.error(error);
    })
    .finally(() => {
        database.end();
    });
