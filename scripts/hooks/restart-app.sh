cd /var/www/tournament-web

yarn install
yarn build
pm2 restart app
