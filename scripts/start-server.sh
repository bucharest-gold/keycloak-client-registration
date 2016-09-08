#!/bin/bash

. scripts/version.sh

function waitForServer {
  C=50
  while [ $C -gt 0 ]
  do
    grep "Keycloak ${VERSION} (WildFly Core 2.0.10.Final) started" keycloak.log
    if [ $? -eq 0 ]; then
      echo "Server started."
      C=0
    else
      echo -n "."
      C=$(( $C - 1 ))
    fi
    sleep 1
  done
}

ARCHIVE="${KEYCLOAK}.tar.gz"
URL="http://downloads.jboss.org/keycloak/${VERSION}/${ARCHIVE}"

# Download keycloak server if we don't already have it
if [ ! -e $KEYCLOAK ]
then
  wget $URL
  tar xzf $ARCHIVE
  rm -f $ARCHIVE
fi

# Start the server
$KEYCLOAK/bin/standalone.sh -Djava.net.preferIPv4Stack=true > keycloak.log 2>&1 &

# Try to add an initial admin user, so we can test against
# the server and not get automatically redirected.
$KEYCLOAK/bin/add-user-keycloak.sh -r master -u admin -p admin
waitForServer

# We have to restart the server for the admin user to load?
$KEYCLOAK/bin/jboss-cli.sh --connect command=:reload
waitForServer
