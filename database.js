require('dotenv').config();
const pg = require('pg');

const dbConfig = { connectionString: process.env.DATABASE_URL };
let db;
if (process.env.NODE_ENV === 'test') {
  db = new pg.Client(dbConfig);
  db.connect();
} else {
  db = new pg.Pool({
    ...dbConfig,
    max: process.env.MAX_CONNECTION || 5,
  });
}

module.exports = {
  query: (sql, params) => {
    console.log('SENDING QUERY | ', sql, params);
    return db.query(sql, params);
  },
  end: () => db.end(),
  POSTGRES_ERROR_CODE: {
    UNIQUE_CONSTRAINT: '23505',
  },
};
