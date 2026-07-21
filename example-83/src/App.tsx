/*
 * Copyright (c) 2022 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL.  USE IS SUBJECT TO LICENSE TERMS.
 */

import React, {useState} from 'react';
import {StyleSheet, Text, ImageBackground, View, Image} from 'react-native';
import {Link} from './components/Link';
import {
  CountFlushPolicy,
  PluginType,
  Plugin,
  SegmentEvent,
} from '@segment/analytics-react-native';
import {createClient} from '@segment/analytics-react-native-plugin-kepler';

const images = {
  kepler: require('./assets/kepler.png'),
  learn: require('./assets/learn.png'),
  support: require('./assets/support.png'),
  build: require('./assets/build.png'),
};

const segmentClient = createClient({
  writeKey: '<writekey>',
  trackAppLifecycleEvents: true,
  debug: true,
  flushPolicies: [new CountFlushPolicy(1)],
});

export class Logger extends Plugin {
  type = PluginType.before;

  execute(event: SegmentEvent) {
    console.log(event);
    return event;
  }
}

segmentClient.add({plugin: new Logger()});
segmentClient.track('App Launched');

export const App = () => {
  const [image, setImage] = useState(images.kepler);

  const styles = getStyles();

  return (
    <ImageBackground
      source={require('./assets/background.png')}
      style={styles.background}>
      <View style={styles.container}>
        <View style={styles.links}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Hello World!</Text>
            <Text style={styles.subHeaderText}>
              Select one of the options below to start your Kepler journey 🚀
            </Text>
          </View>
          <Link
            linkText={'Learn'}
            onPress={() => {
              segmentClient.track('Tapped on Learn');
              setImage(images.learn);
            }}
            testID="sampleLink"
          />
          <Link
            linkText={'Build'}
            onPress={() => {
              segmentClient.track('Tapped on Build');
              setImage(images.build);
            }}
          />
          <Link
            linkText={'Support'}
            onPress={() => {
              segmentClient.track('Tapped on Support');
              setImage(images.support);
            }}
          />
        </View>
        <View style={styles.image}>
          <Image source={image} />
        </View>
      </View>
    </ImageBackground>
  );
};

const getStyles = () =>
  StyleSheet.create({
    background: {
      color: 'white',
      flex: 1,
      flexDirection: 'column',
    },
    container: {
      flex: 6,
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerContainer: {
      marginLeft: 200,
    },
    headerText: {
      color: 'white',
      fontSize: 80,
      marginBottom: 10,
    },
    subHeaderText: {
      color: 'white',
      fontSize: 40,
    },
    links: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-around',
      height: 600,
    },
    image: {
      flex: 1,
      paddingLeft: 150,
    },
    textContainer: {
      justifyContent: 'center',
      flex: 1,
      marginLeft: 190,
    },
    text: {
      color: 'white',
      fontSize: 40,
    },
  });
