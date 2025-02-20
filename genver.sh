export COMMIT_ID=$(git show --format=\'\%H\' --no-patch)
cat << EOF > version.ts
export const version = ${COMMIT_ID}
EOF