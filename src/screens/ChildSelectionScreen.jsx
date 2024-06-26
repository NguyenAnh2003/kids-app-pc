/* eslint-disable prettier/prettier */
import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import {
  Button,
  NativeModules,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import globalStyle from '../styles/globalStyle';
import ChildCard from '../components/cards/ChildCard';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { getAllChildren, getLimitedTime } from '../libs';
import { useDispatch, useSelector } from 'react-redux';
import SplashScreen from './SplashScreen';
import { assignData2Device } from '../redux/actions/actions';

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: 'black',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
  },
  btnText: {
    color: 'white',
  },
});

const reducer = (state, action) => {
  switch (action.type) {
    case 'CHILD_LIST':
      /** return fetched data from api */
      console.log(action.payload);
      return {
        children: action.payload,
        isFetching: false,
      };
    default:
      return { ...state };
  }
};

const ChildSelectionScreen = ({ user, navigation, route }) => {
  /** @author @NguyenAnh2003
   * can be seen as FamilyScreen
   * create child -> button to create child
   * list of child - get child -> return list of child
   */
  const assignDispatch = useDispatch();

  const [state, dispatch] = useReducer(reducer, {
    children: [],
    isFetching: true,
  });
  /** refresh */
  const [refresh, setRefresh] = useState(false);

  const currentUserSession = useSelector((state) => state.userReducers?.user);

  const fetchChildren = async () => {
    try {
      const userId = JSON.parse(currentUserSession.session).user.id; // userId
      const data = await getAllChildren(userId);
      if (data) {
        dispatch({ type: 'CHILD_LIST', payload: data });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  const onRefresh = useCallback(() => {
    setRefresh(true);
    fetchChildren().finally(() => setRefresh(false));
  }, []);

  const submitHandler = async (childId) => {
    const kidData = await getLimitedTime(childId);
    if (kidData) {
      assignDispatch(assignData2Device(JSON.stringify(kidData[0])));
    }
  };

  return state.isFetching ? (
    <SplashScreen />
  ) : (
    <ScrollView
      contentContainerStyle={{ flex: 1 }}
      refreshControl={
        <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
      }
    >
      <View style={[globalStyle.container, { flex: 1, paddingHorizontal: 10 }]}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ flexDirection: 'column', gap: 10, width: '100%' }}>
            {/** list of child */}
            {state &&
              state.children.map((i, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => submitHandler(i.id)}
                >
                  <ChildCard
                    key={i.id}
                    childName={i.kidName}
                    childPhoneNumber={i.phone}
                    childAvatar={i.avatarUrl}
                    phoneType={i.phoneType}
                  />
                </TouchableOpacity>
              ))}
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  );
};

export default ChildSelectionScreen;
