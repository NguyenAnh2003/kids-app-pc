import { View, Text, Image, StyleSheet } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import globalStyle from '../styles/globalStyle';
import { ScrollView } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ActivityCard from '../components/cards/ActivityCard';

const styles = StyleSheet.create({
  /** container */
  container: {
    flexDirection: 'column',
    backgroundColor: '#fafafa',
    paddingHorizontal: 8,
    paddingVertical: 15,
  },
  /** name */
  textHeading: {
    fontSize: 17,
    color: 'black',
  },
  /** flexbox for name and image */
  topBox: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 5,
    paddingBottom: 5,
  },
  avatarChild: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
});

const packageList = [
  {
    id: '1',
    name: 'facebook',
    image:
      'https://scontent.fdad4-1.fna.fbcdn.net/v/t39.30808-1/425501311_1568971097184351_2984175000429861185_n.jpg?stp=dst-jpg_p100x100&_nc_cat=101&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeFuGKlYO-FX7UOWw1MK4RgjmIsKu1lc8vWYiwq7WVzy9UIH3HrTf9T_cpULfVLxssqs7ZOl0EL0qsxA_wK9-i9W&_nc_ohc=IL6rcVXn-rIAX-uit1v&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.fdad4-1.fna&oh=00_AfDwNoK06e0zueKjVxwHndQM5qfswrLwdAi7IMnfyzgqEA&oe=66022134',
    timeUsed: '10 min',
    dateUsed: '22/3/2024',
  },
  {
    id: '2',
    name: 'instagram',
    image:
      'https://scontent.fdad4-1.fna.fbcdn.net/v/t39.30808-1/425501311_1568971097184351_2984175000429861185_n.jpg?stp=dst-jpg_p100x100&_nc_cat=101&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeFuGKlYO-FX7UOWw1MK4RgjmIsKu1lc8vWYiwq7WVzy9UIH3HrTf9T_cpULfVLxssqs7ZOl0EL0qsxA_wK9-i9W&_nc_ohc=IL6rcVXn-rIAX-uit1v&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.fdad4-1.fna&oh=00_AfDwNoK06e0zueKjVxwHndQM5qfswrLwdAi7IMnfyzgqEA&oe=66022134',
    timeUsed: '1 min',
    dateUsed: '22/3/2024',
  },
  {
    id: '3',
    name: 'zalo',
    image:
      'https://scontent.fdad4-1.fna.fbcdn.net/v/t39.30808-1/425501311_1568971097184351_2984175000429861185_n.jpg?stp=dst-jpg_p100x100&_nc_cat=101&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeFuGKlYO-FX7UOWw1MK4RgjmIsKu1lc8vWYiwq7WVzy9UIH3HrTf9T_cpULfVLxssqs7ZOl0EL0qsxA_wK9-i9W&_nc_ohc=IL6rcVXn-rIAX-uit1v&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.fdad4-1.fna&oh=00_AfDwNoK06e0zueKjVxwHndQM5qfswrLwdAi7IMnfyzgqEA&oe=66022134',
    timeUsed: '1 min',
    dateUsed: '22/3/2024',
  },
];

const SingleChildScreen = ({ route, navigation }) => {
  /**
   * @param childId
   * @param childName
   * @param childImage (avatar)
   * @param activities ? (com.package.name, timeUsed, date)
   */
  /** childId -> fetchDataByChildId */
  const { childId, childName, childImage, phoneType } = route.params;

  /** state */
  const [dataa, setDataa] = useState({});

  useEffect(() => {
    /** setup header when (childId, navigation) change */
    navigation.setOptions({
      headerTitle: () => (
        <View style={{ flexDirection: 'row', alignContent: 'center', gap: 10 }}>
          <Image
            source={{ uri: childImage, width: 30, height: 30 }}
            style={{ marginLeft: -20, borderRadius: 10 }}
          />
          <Text style={{ color: '#333', fontSize: 15, fontWeight: '600' }}>
            {childName}
          </Text>
        </View>
      ),
    });

    /** fetch child data by childId */

    /** remove data */
    return () => {
      setDataa({});
    };
  }, [childId, navigation]);

  return (
    <View style={[globalStyle.container, { paddingTop: 20, paddingBottom: 0 }]}>
      {/** child info container */}
      <ScrollView style={styles.container}>
        {/** child view */}
        <View
          style={[
            styles.topBox,
            {
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignContent: 'center',
              paddingRight: 10,
              borderBottomWidth: 1,
              borderColor: '#f2f2f2',
            },
          ]}
        >
          <View style={styles.topBox}>
            <Image source={{ uri: childImage }} style={styles.avatarChild} />
            {/** */}
            <View style={{ flexDirection: 'column' }}>
              <Text style={styles.textHeading}>{childName}</Text>
              <Text style={{ color: '#a5a5a5' }}>{phoneType}</Text>
            </View>
          </View>
          <MaterialCommunityIcons
            name="account-edit-outline"
            size={24}
            color={'black'}
          />
        </View>
        {/** activities view */}
        <Text style={[globalStyle.h1, { marginTop: 5, marginLeft: 5 }]}>
          Recent activities
        </Text>
        {/** block all activities */}
        <View
          style={{
            paddingHorizontal: 15,
            paddingVertical: 15,
            backgroundColor: '#fff',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          {packageList.map((i, index) => (
            <ActivityCard
              key={index}
              packageName={i.name}
              packageImage={i.image}
              packageTimeUsed={i.timeUsed}
              packageDateUsed={i.dateUsed}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default SingleChildScreen;
