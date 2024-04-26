# @segment/analytics-react-native-plugin-kepler

This plugin contains support for Amazon Kepler as a platform for React Native apps.

## Install

Install the dependencies for this package:

`npm install react-native-uuid @amzn/react-native-device-info @segment/analytics-react-native@beta`

Then install this package from tarball (Pending Public Release):

`npm install segment-analytics-react-native-plugin-kepler-0.1.0.tgz`

Now create you client as follows:

```ts
// Import the createClient method from the plugin instead of the core package!
// This automatically sets up all the storage and providers specifically for Amazon Kepler platform
import { createClient } from "@segment/analytics-react-native-plugin-kepler";

const segmentClient = createClient({
  writeKey: "WRITE_KEY",
});
```

You can then make use of the client just as the standard [@segment/analytics-react-native](https://github.com/segmentio/analytics-react-native/blob/ca8fb862663edf3480b42f8a1c77bd6297dd4f2e/README.md#L98) client.

See the [main readme](https://github.com/segmentio/analytics-react-native/blob/ca8fb862663edf3480b42f8a1c77bd6297dd4f2e/README.md#L98) for all options and methods

## Limitations

- `@amzn/react-native-device-info` does not currently support accessing all the device information such as app name and version, screen dimensions, OS versions, locale, etc. Some information inside the context will be set to `unknown` or empty values. These will come online as Amazon starts adding this information in future package releases.
- `trackDeepLinks` option is not supported.
- `Native AnonymousId` is not supported

## Support

Please use Github issues, Pull Requests, or feel free to reach out to our [support team](https://segment.com/help/).

## Integrating with Segment

Interested in integrating your service with us? Check out our [Partners page](https://segment.com/partners/) for more details.

## License

```
MIT License

Copyright (c) 2024 Segment

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
