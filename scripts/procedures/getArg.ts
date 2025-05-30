import { types as T } from "../deps.ts";
import { SetConfig } from "./getConfig.ts";

export type Argument = string & { _type: "argument" };
export async function getArgument(
  effects: T.Effects,
  config: SetConfig,
): Promise<Argument> {
  if (config.argument) {
    return config.argument as Argument;
  }
  try {
    return (await effects.readFile({
      volumeId: "main",
      path: "default_argument.txt",
    })) as Argument;
  } catch (_e) {
    const argument = `start9-${
      (Math.random().toString(36) + "00000000000000011").slice(2, 9 + 2)
    }`;
    await effects.writeFile({
      volumeId: "main",
      path: "default_argument.txt",
      toWrite: argument,
    });
    return argument as Argument;
  }
}
