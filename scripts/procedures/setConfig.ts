// This is where any configuration rules related to the configuration would go. These ensure that the user can only create a valid config.
import { compat, matches, types as T, util } from "../deps.ts";
import { SetConfig, setConfigMatcher } from "./getConfig.ts";
import { Argument, getArgument } from "./getArg.ts";

const { string, boolean, shape, arrayOf } = matches;

type Check = {
  currentError(config: T.Config): string | void;
};

const configRules: Array<Check> = [
  {
    currentError(config) {
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

function configMaker(argument: Argument, config: SetConfig) {
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
argument=${argument}

`;
}

export const setConfig: T.ExpectedExports.setConfig = async (
  effects: T.Effects,
  input: T.Config
) => {
  let config = setConfigMatcher.unsafeCast(input);

  const error = checkConfigRules(config);
  if (error) return error;
  const argument = await getArgument(effects, config);

  await effects.createDir({
    path: "start9",
    volumeId: "main",
  });

  await effects.writeFile({
    path: "config.main",
    toWrite: configMaker(argument, config),
    volumeId: "main",
  });

  await createWaitForService(effects, config);
  return await compat.setConfig(effects, config);
};
