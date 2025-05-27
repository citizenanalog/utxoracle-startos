import { matches, types as T } from "../deps.ts";

const { shape, string } = matches;

const matchOldBitcoindConfig = shape({
  rpc: shape({
    advanced: shape({
      serialversion: matches.any
    }),
  }),
  advanced: shape({
    pruning: shape({
      mode: string,
    }),
  }),
})

const matchBitcoindConfig = shape({
  advanced: shape({
    pruning: shape({
      mode: string,
    }),
  }),
});

export const dependencies: T.ExpectedExports.dependencies = {
  bitcoind: {
    // deno-lint-ignore require-await
    async check(effects, configInput) {
      effects.info("check bitcoind");
      if (matchOldBitcoindConfig.test(configInput) && configInput.advanced.pruning.mode !== "disabled") {
        return {
          error:
            'Pruning must be disabled.',
        };
      }
        return { result: null };
      },
    // deno-lint-ignore require-await
    async autoConfigure(effects, configInput) {
      effects.info("autoconfigure bitcoind");
      if (matchOldBitcoindConfig.test(configInput)) {
        configInput.advanced.pruning.mode = "disabled"
        return { result: configInput}
      } else {
        const config = matchBitcoindConfig.unsafeCast(configInput);
        return { result: config };
      }
    },
  },
};
