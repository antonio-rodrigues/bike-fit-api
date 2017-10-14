# bike-fit-api

Loopback based API to support bikefitapp.com operations

## Pre-requisites

- Loopback / Strongloop 3.x
- socket.io
- MongoDB instance on some server (local or online)

## Install

Run: `npm install`

*Please, adjust settings on datasources to match your MongoDB instance*

## Run

`NODE_ENV=dev nodemon .`

Available NEV parameters:
  - NODE_ENV: dev | production
  - INITDB: true (wipe and recreate Database from sctrach)
  - INIUSERS: true (wipe recreate only Users)
  - INITMETADATA: true (wipe recreate only Metadata)
  - INITBIKES: true (wipe recreate only Bike Data and Types)
  - INISTORAGE: true (wipe recreate only Storage folders)
  - DEV_ACCESS_TOKEN: true (create dev access token)
  - SHOW_EXPLORER: true (enable Loopback API Explorer)
