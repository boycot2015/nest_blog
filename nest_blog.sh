PRO_DIR="/opt/www/web/nest_blog"
SERVER_DIR="/opt/www/web/nest_blog/server"
ADMIN_DIR="/opt/www/web/nest_blog/admin"
MOBILE_DIR="/opt/www/web/nest_blog/client/mobile"
echo "start--------------------"
cd $PRO_DIR
echo "pull git code"

git pull
echo "code pull complete, rebuild blog_server..."

cd $SERVER_DIR
#yarn install
cnpm i
npm run build
pm2 delete 'nest_blog_server'
pm2 start npm --name 'nest_blog_server' -- start --watch
echo "finished-----------------"

echo "rebuild blog_admin..."

cd $ADMIN_DIR
cnpm i
#yarn install
# npm run build
# unzip build.zip
pm2 delete 'my_blog'
pm2 start npm --name 'my_blog' -- start --watch

cd $MOBILE_DIR
npm i
cnpm i node-sass sass-loader --save
#yarn install
npm run build
# unzip build.zip

echo "copy blog_mobile to default host /usr/share/nginx/html..."
scp -r /opt/www/web/nest_blog/client/mobile/dist/build/h5/* /usr/share/nginx/html

echo "complete!-----------------"