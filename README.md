# rv-api
Microservice to calculate and provide RV

docker-compose build

docker-compose run --rm app npm install
docker-compose run --rm app npx sequelize-cli db:migrate
docker-compose run --rm app npx sequelize-cli db:seed:all

docker-compose up

## Test

docker-compose run --rm postgres su postgres
-> createdb -h postgres -U user test

docker-compose run --rm app npx sequelize-cli db:migrate --env=test

docker-compose run --rm app npm test

## Debug Development
docker-compose run --rm -p 9229:9229 app npm run debug.dev

## Debug Development
docker-compose run --rm -p 9229:9229 app npm run debug.test

## Coverage
docker-compose run --rm app npm run coverage
