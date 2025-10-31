#!/bin/bash

AUTH_STRING="mikejshaffer@gmail.com:dd6b n9V7 n02X S7W2 mgL8 wLn5"
AUTH_HEADER=$(echo -n "$AUTH_STRING" | base64)

curl -s "https://shaffercon.com/wp-json/wp/v2/pages/10812" \
  -H "Authorization: Basic $AUTH_HEADER" | jq -r '.content.rendered'
