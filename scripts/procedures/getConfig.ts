// To utilize the default config system built, this file is required. It defines the *structure* of the configuration file. These structured options display as changeable UI elements within the "Config" section of the service details page in the StartOS UI.

//import { compat, types as T } from "../deps.ts";

//export const getConfig: T.ExpectedExports.getConfig = compat.getConfig({});

import { compat } from "../deps.ts";

export const [getConfig, setConfigMatcher] = compat.getConfigAndMatcher({
  alias: {
    type: "string",
    name: "Alias",
    description: "A custom, human-readable name for your node.  This is publicly visible to the Lightning Network.  <b>Default: Unique id of pattern: start9-[random alphanumerics]</b>",
    nullable: true,
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
