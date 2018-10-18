cd client
npm install
REACT_APP_VERSION=`git rev-parse HEAD`
REACT_APP_TIME=`date`
npm run build
mkdir ../server/public/
\cp -r ./build/* ../server/public/
cd ../server/
sbt dist
if [[ $TRAVIS_BRANCH = "master"  &&  $TRAVIS_PULL_REQUEST = false ]]
then
    export SSHPASS=$SERVER_PW

    cd ..
    zip -r push-service.zip . -i ./push-service/
    sshpass -e scp -o stricthostkeychecking=no ./push-service.zip $DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH
    cd server

    sshpass -e scp -o stricthostkeychecking=no ./target/universal/em-server-1.0-SNAPSHOT.zip $DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH
    sshpass -e ssh -o stricthostkeychecking=no $DEPLOY_USER@$DEPLOY_HOST $DEPLOY_PATH/server.sh
fi