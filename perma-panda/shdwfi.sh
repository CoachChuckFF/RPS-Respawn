#! /bin/bash

yarn build
rm -rf shdw
cp -rf build/ shdw/
rm -rf shdw/static
cp build/static/css/main.css shdw/
cp build/static/js/main.js shdw/
