#!/bin/bash
# crisis-countries/json/source/twitter/by_Peaceforce/
tar --exclude='crisis-countries/json/*.pkl' \
    --exclude='crisis-countries/json/*.gif' \
    --exclude='crisis-countries/json/*.jpg' \
    --exclude='crisis-countries/json/*.jpeg' \
    --exclude='crisis-countries/json/*.png' \
    -cLzvf blu-pen.tar.gz blu-pen crisis-countries
