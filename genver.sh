#!/usr/bin/bash
BUILD_DIR=build
mkdir -p $BUILD_DIR
export COMMIT_ID=$(git show --format=\'\%H\' --no-patch)
cat << EOF > ${BUILD_DIR}/version.ts
export const version = ${COMMIT_ID}
EOF