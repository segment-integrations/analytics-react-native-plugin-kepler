# Release

Releases are manual and private for now. The package is marked as private since Amazon doesn't want to publish this package to NPM until official release.

To create a manual relase:

1. Update the version number of the package by running `npm version --patch` or manually in `package.json`
2. `npm run build`
3. Run `npm pack`
4. Share the tarball file
