# Final Capstone Project: Periodic Tables Restaurant Reservation System

Welcome to Periodic Tables, a restaurant reservation system. The software is used only by restaurant personnel when a 
guest calls to request a reservation. Simply type in the guest's information in our easy to use form, and you will have 
an easy way to keep track of all of your reservations. Not only that, but you can even use it to seat guests at a table!


![Dashboard](/new_reservation.png "Dashboard")

## Features
- **Dashboard**: Displays all of the reservations for the day, all of the tables in the restaurant, and whether or not 
the reservations have been seated
- **Create reservation**: Store a guest's reservation info
- **Create table**: Allows the user to create the restaurant's tables with a table name (or number) and size
- **Seat reservation**: A button that allows the user to seat a reservation at a table of their choice
- **Search reservation**: Search a guest's reservation by phone number
- **Edit reservation**: Modify a reservation if a guest calls to change or cancel their reservation


![Dashboard](/dashboard.png "Dashboard")

## Technology
- JavaScript
- React
- Bootstrap
- Node.js
- Express
- Knex
- PostgreSQL

## API Documentation
The table below describes the reservation resource
| Reservations API Available Paths & Methods  | Description                                                             |
| ------------------------------------------- | ----------------------------------------------------------------------- |
| GET `/reservations`                         | Returns all reservations                                                |
| GET `/reservations?date={date} `            | Returns all reservations for that date in the format date=YYYY-MM-DD    |
| POST `/reservations`                        | Creates a new reservation with a unique `reservation_id`                |
| PUT `/reservations/{reservation_id}`        | Edits a specific reservation for the given `reservation_id`             |
| PUT `/reservations/{reservation_id}/status` | Updates status of a specific reservation for the given `reservation_id` |
The table below describes the tables resource
| Tables API Available Paths & Methods | Description                                                             |
| ------------------------------------ | ----------------------------------------------------------------------- |
| GET `/tables`                        | Returns all tables                                                      |
| POST `/tables`                       | Creates a new table with a unique `table_id`                            |
| PUT `/tables/{table_id}/seat`        | Assigns a reservation to the table by adding the `reservation_id`       |
| DELETE `/tables/{table_id}/seat`     | Updates status of a specific reservation for the given `reservation_id` |
The table below describes the folders in this repository:
| Folder/file path | Description                                                      |
| ---------------- | ---------------------------------------------------------------- |
| `./back-end`     | The backend project, which runs on `localhost:5000` by default.  |
| `./front-end`    | The frontend project, which runs on `localhost:3000` by default. |

### Knex
Run `npx knex` commands from within the `back-end` folder, which is where the `knexfile.js` file is located

## Discoveries
Learned how to create a fully working app from the ground up. Created a front-end, back-end, and database. Discovered how 
to deploy each part and have it working in perfect harmony. Brushed up on certain React concepts that I had struggled with, 
and learned how to format things like date and time.

## Future Goals
Would like to add more styling to the navbar, and list the reservation phone numbers and time in a more readable format.
Would also like to add table icons to each table to display the size of the table.

## Getting started
### Use the app
The app is fully functional and ready to be used and enjoyed. 
[Periodic Tables](https://periodic-tables-mark-client.herokuapp.com/)

### Installation
If you would like to run the repo locally, follow these steps:
1. Fork and clone this repository.
2. Run `cp ./back-end/.env.sample ./back-end/.env`.
3. Update the `./back-end/.env` file with the connection URL's to your ElephantSQL database instance.
4. Run `cp ./front-end/.env.sample ./front-end/.env`.
5. You should not need to make changes to the `./front-end/.env` file unless you want to connect to a backend at a 
location other than `http://localhost:5000`.
6. Run `npm install` to install project dependencies.
7. Run `npm run start:dev` to start your server in development mode.
