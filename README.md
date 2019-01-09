[![Build Status](https://travis-ci.org/valenstical/ireporter.svg?branch=develop&q=1)](https://travis-ci.org/valenstical/ireporter)
[![Coverage Status](https://coveralls.io/repos/github/valenstical/ireporter/badge.svg?branch=develop&q=1)](https://coveralls.io/github/valenstical/ireporter?branch=develop)
[![Maintainability](https://api.codeclimate.com/v1/badges/cc83bc74765efd66a6cc/maintainability)](https://codeclimate.com/github/valenstical/ireporter/maintainability)
[![Greenkeeper badge](https://badges.greenkeeper.io/valenstical/ireporter.svg)](https://greenkeeper.io/)
# ireporter
Simple web app that lets citizens report cases of corruption to the appropriate authorities. Users can also report on things that needs government intervention.

## Required Features

- Users can create an account
- Users can log into their account
- Users can make a red-flag or intervention record
- Users can edit their red-flag or intervention record
- Admin can change status of ared-flag or intervention record from under investigation, resolved or rejected.

## Technologies

- Node JS
- Express
- Mocha & Chai
- ESLint
- Babel
- Travis CI
- Code Climate
- Coveralls

## Requirements and Installation
Install Node Js and Git
- Node Js
- Git

To run:
```
$ git clone https://github.com/valenstical/ireporter.git
$ cd ireporter
$ npm install
$ npm start
```
## Testing
```
$ npm test
```

## Pivotal Tracker stories
View the pivotal tracker stories for this project here [https://www.pivotaltracker.com/projects/2227161](https://www.pivotaltracker.com/projects/2227161)

## Front-end Design

You can see a hosted version of the frontend at [https://valenstical.github.io/ireporter/](https://valenstical.github.io/ireporter/)

## API

The api endpoints are hosted on heroku. Visit https://ireporter-nigeria.herokuapp.com/ to make requests to endpoints.

## API Endpoints
All API endpoint must use the api/v1 prefix.

| Endpoint                                         | Functionality                            |
| ------------------------------------------------ | -----------------------------------------|
| GET /red-flags                                           | Get all red-flags reports              |
| GET /red-flags/\<red-flag-id>                            | Get the details of a specific red-flag   |
| PATCH /red-flags/\<red-flag-id>/location                 | Edit the location of a red-flag report |
| PATCH /red-flags/\<red-flag-id>/comment                  | Edit the comment of a red-flag report  |
| DELETE /red-flags/\<red-flag-id>                         | Delete a red-flag                 |
| GET /interventions                                       | Get all interventions reports              |
| GET /interventions/\<intervention-id>                    | Get the details of a specific intervention   |
| PATCH /interventions/\<intervention-id>/location         | Edit the location of an intervention report |
| PATCH /interventions/\<intervention-id>/comment          | Edit the comment of an intervention report  |
| DELETE /interventions/\<intervention-id>                 | Delete an intervention                 |
| POST /interventions/                                     | Creates a new intervention record  |
| POST /red-flags/                                         | Creates a new red-flag record  |
| PATCH /interventions/\<intervention-id>/status           | Change the status of an intervention report |
| PATCH /red-flags/\<red-flag-id>/status                   | Change the status of a red-flag report |

## API Documentation
https://app.swaggerhub.com/apis/andela51/1-i_reporter/1.0



## Author

Okosun Valentine Ejodamen
