#!/bin/sh
if [ ! -f /app/writefreely.db ]; then
    ./writefreely --create-admin
fi

./writefreely
