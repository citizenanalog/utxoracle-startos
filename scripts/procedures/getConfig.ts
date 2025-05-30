// To utilize the default config system built, this file is required. It defines the *structure* of the configuration file. These structured options display as changeable UI elements within the "Config" section of the service details page in the StartOS UI.

//import { compat, types as T } from "../deps.ts";

//export const getConfig: T.ExpectedExports.getConfig = compat.getConfig({});

import { compat } from "../deps.ts";

export const [getConfig, setConfigMatcher] = compat.getConfigAndMatcher({
  argument: {
    type: "string",
    name: "Argument (-rb, -d YYYY/MM/DD)",
    description:
    "Input argument options:\n-h Show this help message\n-d YYYY/MM/DD Specify a UTC date to evaluate\n-p /path/to/dir  Specify the data directory for blk files\n-rb Use last 144 recent blocks instead of date mode\n<b>Default: -rb Recent Block Mode</b>",
    nullable: true,
    tag: {
      "id": "type",
      "name": "Input Argument (-rb, -d YYYY/MM/DD, -p /path/to/dir)",
      },
      "description":
      "Input argument options:\n-h Show this help message\n-d YYYY/MM/DD Specify a UTC date to evaluate\n-p /path/to/dir  Specify the data directory for blk files\n-rb Use last 144 recent blocks instead of date mode\n<b>Default: -rb Recent Block Mode</b>",
    "package-id": "utxoracle",
    pattern: ".{1,32}",
      "pattern-description":
      "Must be at least 1 character and no more than 32 characters",
    },
  "bitcoin-user": {
    type: "pointer",
    name: "RPC Username",
    description: "The username for Bitcoin Core's RPC interface.",
    subtype: "package",
    "package-id": "bitcoind",
    target: "config",
    multi: false,
    selector: "$.rpc.username",
  },
  "bitcoin-password": {
    type: "pointer",
    name: "RPC Password",
    description: "The password for Bitcoin Core's RPC interface.",
    subtype: "package",
    "package-id": "bitcoind",
    target: "config",
    multi: false,
    selector: "$.rpc.password",
  },
} as const,
);

export type SetConfig = typeof setConfigMatcher._TYPE;
