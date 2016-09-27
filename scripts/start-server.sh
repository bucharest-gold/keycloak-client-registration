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

docker pull jboss/keycloak:${VERSION}
docker run -e KEYCLOAK_USER=admin -e KEYCLOAK_PASSWORD=admin -p 8080:8080 jboss/keycloak:${VERSION} > keycloak.log 2>&1 &
waitForServer