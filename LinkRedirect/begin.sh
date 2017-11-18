#!/bin/bash

redis-server --daemonize yes
ps aux | grep redis-server
node appGET.js
