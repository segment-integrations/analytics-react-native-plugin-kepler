# @segment/analytics-react-native-plugin-kepler

This plugin contains support for Amazon Vega as a platform for React Native apps.

## Install

Install the dependencies for this package:

```
npm install react-native-uuid \
  @amazon-devices/react-native-device-info@2.1.9000000000-rn-83 \
  @amazon-devices/react-native-localize@2.1.9000000000-rn-83 \
  "@react-native-async-storage/async-storage@npm:@amazon-devices/react-native-async-storage__async-storage@2.1.9000000000-rn-83" \
  @segment/analytics-react-native
```

Then install this package from npm registry:

`npm install @segment/analytics-react-native-plugin-kepler`

> **React Native 0.83 / Vega SDK 0.24:** Use plugin version `^2.0.0`. If your app is still on RN 0.72 / Vega SDK ≤0.19, pin to plugin version `^1.0.0`.

Now create you client as follows:

```ts
// Import the createClient method from the plugin instead of the core package!
// This automatically sets up all the storage and providers specifically for Amazon Vega platform
import { createClient } from "@segment/analytics-react-native-plugin-kepler";

const segmentClient = createClient({
  writeKey: "WRITE_KEY",
});
```

You can then make use of the client just as the standard [@segment/analytics-react-native](https://github.com/segmentio/analytics-react-native/blob/ca8fb862663edf3480b42f8a1c77bd6297dd4f2e/README.md#L98) client.

See the [main readme](https://github.com/segmentio/analytics-react-native/blob/ca8fb862663edf3480b42f8a1c77bd6297dd4f2e/README.md#L98) for all options and methods

## Limitations

- `@amazon-devices/react-native-device-info` does not currently support accessing all the device information such as app name and version, screen dimensions, OS versions, locale, etc. Some information inside the context will be set to `unknown` or empty values. These will come online as Amazon starts adding this information in future package releases.
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
