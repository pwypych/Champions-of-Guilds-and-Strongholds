#!/bin/bash
echo "*** START build_client.bash ***"
echo "concatenate chatroom modules"
cat client/* > public/build/bundle.js
# echo "uglyfy chatroom modules"
# uglifyjs client/public/chatroom/chatroom.js -o client/public/chatroom/chatroom.min.js
# echo "deleting temporary file"
# rm client/public/chatroom/chatroom.js
echo "*** END build_client.bash ***"
