#!/bin/bash

wget http://download.redis.io/redis-stable.tar.gz
tar xvzf redis-stable.tar.gz
cd redis-stable
cd deps
make hiredis jemalloc linenoise lua geohash-int
cd ..
make 
make install
#redis-server --daemonize yes
#ps aux | grep redis-server
#redis-server
#node appGET.js

