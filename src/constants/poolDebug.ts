export const BUILD_NODE_CODE = `cd ~/git git clone
https://github.com/input-output-hk/cardano-node
cd cardano-node
cabal update git fetch --tags --all
git pull
git checkout $(curl -s https://api.github.com/repos/input-output-hk/cardano-node/releases/latest | jq -r .tag_name)
cabal build cardano-node cardano-cli`;
