# Key-Value store

> When in VSCode, press `CTRL + SHIFT + V` to view this `README.md` pretty formatted

## Setup

1. Setup `.env` file.

    Create a new file `.env` in the root directory with the following content:

    ```
    DB_HOST=
    DB_USER=
    DB_PASSWORD=
    DB_DATABASE=
    ```

    > Set the value of each key accordingly
    >
    > You can register for a free MySQL database instance (No credit card required) at [PlanetScale.com](https://planetscale.com)
    >
    > Instructions: https://planetscale.com/docs/tutorials/planetscale-quick-start-guide#getting-started-planet-scale-dashboard

2. Install dependencies

    ```
    > npm install
    ```

3. Initialize Database

    ```
    > npm run init_db
    ```

    > Question: What is this executing? Which files are involved? How do you know?

4. Test that you setup correctly

    ```
    > npm run test
    ```

5. Run the server in development mode (with auto-reload)

    ```
    > npm run dev
    ```

    > Question: What is this executing? What command exactly?
