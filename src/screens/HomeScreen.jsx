import {
  View,
  Text,
  Image,
  StyleSheet,
  NativeModules,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import globalStyle from '../styles/globalStyle';
import { ScrollView } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ActivityCard from '../components/cards/ActivityCard';
import UsageChart from '../components/UsageChart';
import packageList from '../mock/activities';
import { getAllActivities, getChildInfo } from '../libs';
import { processAppIcon } from '../libs/utils';
import SplashScreen from './SplashScreen';

const styles = StyleSheet.create({
  /** container */
  container: {
    flex: 1,
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

const numDay = 2;
const numWeek = 1;

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_ACTIVITIES':
      return { activities: action.payload, isFetching: false };
    default:
      return { ...state };
  }
};

const HomeScreen = ({ navigation, route }) => {
  /**
   * @param childId
   * @param childName
   * @param childImage (avatar)
   */
  const { childId, childName, childImage, phoneType } = route.params;
  const [option, setOption] = useState('recent');
  const options = ['recent', '5 days'];
  const [activities, setActivities] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [state, dispatch] = useReducer(reducer, {
    activities: [],
    isFetching: true,
  });

  const onRefresh = useCallback(() => {
    setRefresh(true);
    /** fetch data again */
    fetchUsage();
    setRefresh(false);
  }, []);

  const dataBasedonTime = useMemo(() => {
    if (state.activities) {
      if (option === 'recent') {
        const today = new Date();
        const today2 = new Date(today);
        today2.setDate(today.getDate() - 1 * numDay);

        const todayUsage = state.activities.filter((item) => {
          const itemDate = new Date(item.dateUsed);
          // Compare timestamps of itemDate and previousDay
          return (
            itemDate.getTime() >= today2.getTime() &&
            itemDate.getTime() < today.getTime()
          );
        });

        return todayUsage;
      }
      if (option === '5 days') {
        const today = new Date();

        const previousWeek = new Date(today);
        previousWeek.setDate(today.getDate() - 7 * numWeek);

        // Filter data for the previous day
        const previousWeekData = state.activities.filter((item) => {
          const itemDate = new Date(item.dateUsed);
          // Compare timestamps of itemDate and previousWeek
          return itemDate >= previousWeek && itemDate < today;
        });

        return previousWeekData;
      }
    }
  }, [option, state.activities]);

  /** fetch child data by childId */
  const fetchUsage = async () => {
    const activities = await getAllActivities(childId);
    if (activities) {
      const processedActivities = activities.map((i) => {
        const processedDateUsed = i.dateUsed.split('T')[0];
        const processedTimeUsed = Number(i.timeUsed);
        const id = i.id.toString();
        return {
          ...i,
          id: id,
          dateUsed: processedDateUsed,
          timeUsed: processedTimeUsed,
        };
      });

      const result = await processAppIcon(processedActivities);
      dispatch({ type: 'FETCH_ACTIVITIES', payload: result });
    }
  };

  /** setup header when nav &I childId change */
  useEffect(() => {
    /** setup header when (childId, navigation) change */
    navigation.setOptions({
      headerTitle: () => (
        <View
          style={{
            flexDirection: 'row',
            alignContent: 'center',
            gap: 10,
            marginLeft: 15,
          }}
        >
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

    fetchUsage();

    /** remove data */
    return () => {};
  }, [navigation]);

  return state.isFetching ? (
    <SplashScreen />
  ) : (
    <ScrollView
      contentContainerStyle={{ flex: 1 }}
      refreshControl={
        <RefreshControl onRefresh={onRefresh} refreshing={refresh} />
      }
    >
      <View
        style={[globalStyle.container, { paddingTop: 20, paddingBottom: 0 }]}
      >
        {/** child info container */}
        <View style={styles.container}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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
                <Image
                  source={{ uri: childImage }}
                  style={styles.avatarChild}
                />
                {/** */}
                <View style={{ flexDirection: 'column' }}>
                  <Text style={styles.textHeading}>{childName}</Text>
                  <Text style={{ color: '#a5a5a5' }}>{phoneType}</Text>
                </View>
              </View>
            </View>
            {/** activities view */}
            <View
              style={{
                flexDirection: 'row',
                gap: 10,
              }}
            >
              {options.map((i, index) => (
                <TouchableOpacity
                  key={index}
                  style={{ padding: 10, backgroundColor: '#000', minWidth: 80 }}
                  onPress={() => setOption(i)}
                >
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 15,
                      fontWeight: 600,
                      textAlign: 'center',
                    }}
                  >
                    {i.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text
              style={{
                color: 'black',
                marginTop: 15,
                marginLeft: 5,
                fontSize: 20,
                fontWeight: '700',
              }}
            >
              Activities in {option.toUpperCase()}
            </Text>
            {/** block activities today */}
            <View style={{ maxHeight: 200 }}>
              {dataBasedonTime?.length !== 0 ? (
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                  <View
                    style={{
                      paddingHorizontal: 15,
                      paddingVertical: 15,
                      backgroundColor: '#fff',
                      flexDirection: 'column',
                      gap: 12,
                    }}
                  >
                    {dataBasedonTime?.map((i, index) => (
                      <ActivityCard
                        key={index}
                        packageName={i.name}
                        packageImage={i.icon}
                        packageTimeUsed={i.timeUsed}
                        packageDateUsed={i.dateUsed}
                      />
                    ))}
                  </View>
                </ScrollView>
              ) : (
                <Text
                  style={{
                    color: 'red',
                    marginTop: 95,
                    marginLeft: 5,
                    fontSize: 20,
                    fontWeight: '500',
                    textAlign: 'center',
                  }}
                >
                  There is no activities in recent
                </Text>
              )}
            </View>
            {/** activities last week view */}
            {dataBasedonTime?.length !== 0 ? (
              <>
                <Text
                  style={{
                    color: 'black',
                    marginLeft: 5,
                    fontSize: 20,
                    fontWeight: '600',
                  }}
                >
                  Usage Chart
                </Text>
                {dataBasedonTime && <UsageChart activities={dataBasedonTime} />}
              </>
            ) : (
              <></>
            )}
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
