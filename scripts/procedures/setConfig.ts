// This is where any configuration rules related to the configuration would go. These ensure that the user can only create a valid config.

//port { compat, } from "../deps.ts";

//port const setConfig = compat.setConfig;

import { compat, matches, types as T, util } from "../deps.ts";
import { SetConfig, setConfigMatcher } from "./getConfig.ts";
import { Alias, getAlias } from "./getAlias.ts";

const { string, boolean, shape, arrayOf } = matches;

type Check = {
  currentError(config: T.Config): string | void;
};
const matchWTtEnabledConfig = shape({
  watchtowers: shape({
    "wt-server": boolean,
    "wt-client": shape({
      "enabled": string,
      "add-watchtowers": arrayOf(string),
    })
  }),
});
const configRules: Array<Check> = [
  {
    currentError(config) {
      if (matchWTtEnabledConfig.test(config)) {
        for (const outerIndex in config.watchtowers["wt-client"]["add-watchtowers"]) {
          const outerTowerUri = config.watchtowers["wt-client"]["add-watchtowers"][outerIndex];
          for (const innerIndex in config.watchtowers["wt-client"]["add-watchtowers"]) {
            const innerTowerUri =
              config.watchtowers["wt-client"]["add-watchtowers"][innerIndex];
            if (outerIndex != innerIndex) {
              if (
                outerTowerUri.split("@")[0] == innerTowerUri.split("@")[0]
              ) {
                return `Cannot add multiple watchtowers with the same pubkey`;
              }
            }
          }
        }
      }
    },
  },
];

function checkConfigRules(config: T.Config): T.KnownError | void {
  for (const checker of configRules) {
    const error = checker.currentError(config);
    if (error) {
      return { error: error };
    }
  }
}

async function createWaitForService(effects: T.Effects, config: SetConfig) {
  const {
    bitcoin_rpc_host,
    bitcoin_rpc_pass,
    bitcoin_rpc_port,
    bitcoin_rpc_user,
  } = userInformation(config);
  await effects.writeFile({
    path: "start9/waitForStart.sh",
    toWrite: `
#!/bin/sh
echo "Starting Wait for Bitcoin Start"
while true; do
  bitcoin-cli -rpcconnect=${bitcoin_rpc_host} -rpcport=${bitcoin_rpc_port} -rpcuser=${bitcoin_rpc_user} -rpcpassword=${bitcoin_rpc_pass} getblockchaininfo > /dev/null
  if [ $? -eq 0 ]
  then
    break
  else
    echo "Waiting for Bitcoin to start..."
    sleep 1
  fi
done
    `,
    volumeId: "main",
  });
}

function userInformation(config: SetConfig) {
  return {
    bitcoin_rpc_user: config["bitcoin-user"],
    bitcoin_rpc_pass: config["bitcoin-password"],
    bitcoin_rpc_host: "bitcoind.embassy",
    bitcoin_rpc_port: 8332,
  };
}

function configMaker(alias: Alias, config: SetConfig) {
  const {
    bitcoin_rpc_host,
    bitcoin_rpc_pass,
    bitcoin_rpc_port,
    bitcoin_rpc_user,
  } = userInformation(config);

  return `
network=bitcoin
bitcoin-rpcuser=${bitcoin_rpc_user}
bitcoin-rpcpassword=${bitcoin_rpc_pass}
bitcoin-rpcconnect=${bitcoin_rpc_host}
bitcoin-rpcport=${bitcoin_rpc_port}

bind-addr=0.0.0.0:9735
announce-addr=${config["peer-tor-address"]}:9735
proxy={proxy}
always-use-proxy=${config.advanced["tor-only"]}

alias=${alias}
rgb=${config.color}

fee-base=${config.advanced["fee-base"]}
fee-per-satoshi=${config.advanced["fee-rate"]}
min-capacity-sat=${config.advanced["min-capacity"]}
ignore-fee-limits=${config.advanced["ignore-fee-limits"]}
funding-confirms=${config.advanced["funding-confirms"]}
cltv-delta=${config.advanced["cltv-delta"]}

bind-addr=ws::4269
grpc-port=2106

`;
}
const validURI = /^([a-fA-F0-9]{66}@)([^:]+?)(:\d{1,5})?$/m;
export const setConfig: T.ExpectedExports.setConfig = async (
  effects: T.Effects,
  input: T.Config
) => {
  let config = setConfigMatcher.unsafeCast(input);
  try {
    if (config.watchtowers["wt-client"].enabled == "enabled") {
      const _watchTowers = config
        .watchtowers["wt-client"]["add-watchtowers"]
        .map((x) => {
          const matched = x.match(validURI);
          if (matched === null) {
            throw `Invalid watchtower URI: ${x} doesn't match the form pubkey@host:port`;
          }
          if (matched[3] == null) {
            return `${matched[1]}${matched[2]}:9814`;
          }
          return x;
        });
      config = {
        ...config,
        watchtowers: {
          ...config.watchtowers,
        },
      };
    }
  } catch (e) {
    return util.error(e);
  }

  const error = checkConfigRules(config);
  if (error) return error;
  const alias = await getAlias(effects, config);

  await effects.createDir({
    path: "start9",
    volumeId: "main",
  });

  await effects.writeFile({
    path: "config.main",
    toWrite: configMaker(alias, config),
    volumeId: "main",
  });

  await createWaitForService(effects, config);
  return await compat.setConfig(effects, config);
};
