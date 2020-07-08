#!/bin/bash
echo "*** START deploy.bash ***"
echo " "
echo "*** Local push ***"
git push

ssh ftpuser@51.68.142.93 -p 2222 << EOF
echo " "
echo "*** Change to cogs directory ***"
cd ~/node/cogs/axe/current/
pwd
echo " "
echo "*** Git pull ***"
echo " "
git pull
echo " "
echo "*** Restart Node server ***"
echo " "
/home/ftpuser/npm/bin/pm2 restart cogs_axe
EOF

echo "*** END deploy.bash ***"
