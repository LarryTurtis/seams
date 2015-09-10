#!/bin/bash
mongoimport --db test --collection products --drop --file sampleData.json
cp -r img ../app/img
