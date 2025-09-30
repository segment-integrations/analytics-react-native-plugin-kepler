# Contributing

Consult [Amazon Kepler documentation](https://developer.amazon.com/docs/kepler-tv)

Follow the [Intructions](https://developer.amazon.com/docs/kepler-tv/install-mac-linux.html#) for setting up your Amazon Kepler environment

## Running Example

These instructions run the App in Fast Refresh mode so you can make changes and have them reload in the app:

1. Go into the `example` directory and open 2 terminal windows (A & B)
2. Terminal A: `kepler device simulator start`
3. Terminal B: `npm start`
4. Terminal A: `kepler device start-port-forwarding --device Simulator -p 8081 --forward false`
5. Terminal A: `kepler build -b Debug`
6. Terminal A: `kepler run-kepler build/vega-tv2023-aarch64-debug/amazonkepler_aarch64.vpkg com.segment.keplersample.main -s`

> Note: If you have trouble running `kepler build` try sourcing the environment first!
> `source ~/.kepler/kntools/environment-setup-sdk.sh`

> Note: Right now the system is set to load the plugin from the tarball file in the root. If you make changes in the library itself you will have to `npm pack` to make sure it reloads everything!

Future Work: package redirects just like in the core monorepo

## Working on the Library

The library itself is plain TS code. As such you can use any normal NPM commands.

`npm build # compiles TS code`

`npm pack # pack for sharing a release`

Note: Due to how Amazon Vega gets injected currently this only supports Node v18 + NPM. Do not try to use Yarn/PNPM with this!
