# Key-Value store

> When in VSCode, press `CTRL + SHIFT + V` to view this `README.md` pretty formatted

## Setup

> All following instructions are to be executed in the `backend` folder

1. Setup `.env` file.

    Create a new file `.env` with the following content:

    ```
    DATABASE_URL=<DATABASE_URL>
    ```

    > Replace `<DATABASE_URL>` with the connection string to a PostgreSql database (e.g. `DATABASE_URL=postgres://username:password@host.elephantsql.com/user`)
    >
    > You can register for a free database instance (No credit card required) at [ElephantSql.com](www.elephantsql.com)
    >
    > ![elephantsql connection string](https://marcopeg.com/content/images/2021/11/image-33.png)

2. Install dependencies

    ```
    ./backend> npm install
    ```

3. Initialize Database

    ```
    ./backend> npm run init_db
    ```

    > Question: What is this executing? Which files are involved? How do you know?

4. Test that you setup correctly

    ```
    ./backend> npm run test
    ```

5. Run the server in development mode (with auto-reload)

    ```
    ./backend> npm run dev
    ```
