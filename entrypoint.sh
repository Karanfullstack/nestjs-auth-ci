#!/bin/sh

wait-for-it.sh db:5432 -- echo "PostgreSQL is up"
wait-for-it.sh redis:6379 -- echo "Redis is up"

npm run start:dev
