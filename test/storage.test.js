const { query, end } = require('../database');
const { add, get, getTimestampAfterNDays } = require('../storage');

beforeEach(() => query('BEGIN;'));
afterEach(() => query('ROLLBACK;'));
afterAll(() => end());
it('Should provide a key if not given', async () => {
    expect.assertions(1);
    const key = await add({ hello: 'world' });
    expect(key).toBeTruthy();
});

it('Should use given key', async () => {
    expect.assertions(1);
    const key = 'abc123';
    const newKey = await add({ hello: 'world' }, key);
    expect(key).toEqual(newKey);
});

it('Should use reject used key', async () => {
    expect.assertions(1);
    const key = 'abc123';
    await add({ hello: 'world' }, key);
    try {
        await add({ hello: 'world' }, key);
    } catch (error) {
        expect(error.message).toMatch(`Key ${key} already exists`);
    }
});

it('Should retrieve data', async () => {
    expect.assertions(1);
    const data = { hello: 'world' };
    const key = await add(data);
    const retrievedData = await get(key);
    expect(retrievedData).toEqual(data);
});

it('Should not expire after 4 days by default', async () => {
    expect.assertions(1);
    const data = { hello: 'world' };
    const key = await add(data);
    const retrievedData = await get(key, getTimestampAfterNDays(4));
    expect(retrievedData).toEqual(data);
});

it('Should expire after 7 days by default', async () => {
    expect.assertions(1);
    const data = { hello: 'world' };
    const key = await add(data);
    const retrievedData = await get(key, getTimestampAfterNDays(7));
    expect(retrievedData).toBeNull();
});
