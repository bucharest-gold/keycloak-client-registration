#!/bin/bash

. test/scripts/version.sh

${KEYCLOAK}/bin/jboss-cli.sh --connect command=:shutdown
