cd client
npm install
npm run build
mkdir ../server/public/
\cp -r ./build/* ../server/public/
cd ../server/
sbt dist
if [[ $TRAVIS_BRANCH = "master"  &&  $TRAVIS_PULL_REQUEST = false ]]
then
    export SSHPASS=$SERVER_PW
    sshpass -e scp -o stricthostkeychecking=no ./target/universal/em-server-1.0-SNAPSHOT.zip $DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH
    sshpass -e ssh -o stricthostkeychecking=no $DEPLOY_USER@$DEPLOY_HOST $DEPLOY_PATH/server.sh
fi