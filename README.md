*****************************************
# Xkool eShop Backend

## Description
A backend application for the Xkool eShop web application. This application provides RESTful APIs to manage programs and orders for the eShop.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Dependencies](#dependencies)
- [Author](#author)

## Installation
To get started with the Xkool eShop backend, clone the repository and install the dependencies.

```bash
git clone https://github.com/EdwinAbdonShayo/Xkool-eShop-BackEnd.git

cd Xkool-eShop-BackEnd

npm install
```
## Usage

- This backend app is also hosted on render at:
[link to render.com](https://xkool-eshop-backend.onrender.com/)

- To start the application, use the following command:

```bash
npm start
```

The application will run on the configured port (default is 5454). You can access it at `http://localhost:5454`.

## API Endpoints
### Base Route
- `GET /`
    - Returns a welcome message and links to the GitHub profile and donation page.
### Programs
- `GET /programs`
    - Retrieves all programs from the database.
- `PUT /programs/:id`
    - Updates a program by its ID. Requires the new data in the request body.
### Orders
- `GET /orders`
    - Retrieves all orders from the database (for testing purposes).
- `POST /orders`
    - Creates a new order. Requires the order data in the request body.
### Search
- `GET /search?term=<search_query>`
    - Searches for programs based on the provided search term. Returns matching results.
## Dependencies
- `cors`: ^2.8.5
- `express`: ^4.21.1
- `mongodb`: ^6.10.0
- `morgan`: ^1.10.0
- `nodemon`: ^3.1.7
- `path`: ^0.12.7
- `properties-reader`: ^2.3.0
## Author
[Edwin Abdon SHAYO](https://edwinshayo.com)

*************************************