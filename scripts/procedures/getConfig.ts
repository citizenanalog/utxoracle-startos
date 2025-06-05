// To utilize the default config system built, this file is required. It defines the *structure* of the configuration file. These structured options display as changeable UI elements within the "Config" section of the service details page in the StartOS UI.

//import { compat, types as T } from "../deps.ts";

//export const getConfig: T.ExpectedExports.getConfig = compat.getConfig({});

import { compat } from "../deps.ts";

export const [getConfig, setConfigMatcher] = compat.getConfigAndMatcher({
  argument: {
    type: "string",
    name: "Argument (YYYY/MM/DD or y or rb)",
    description:
    "Input argument options: YYYY/MM/DD Specify a UTC date to evaluate or 'y' to run yesterday's date.\\n<b>Default (no input): -rb Recent Block Mode</b>",
    nullable: true,
    tag: {
      "id": "type",
      "name": "Input Argument (-y Evaluate yesterday, -rb, -d YYYY/MM/DD, -p /path/to/dir)",
      },
      "description":
      "Input argument options: YYYY/MM/DD Specify a UTC date to evaluate or 'y' to run yesterday's date. <b>Default (no input): -rb Recent Block Mode</b>",
    "package-id": "utxoracle",
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
