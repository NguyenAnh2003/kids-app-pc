import { View, Text, Button } from 'react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';

const StickyButton = ({onPress}) => {
  return (
    <TouchableOpacity
      style={{
        width: 60,
        height: 60,
        borderRadius: 50,
        backgroundColor: '#fdf6e2',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 35,
        right: 20,
        alignSelf: 'flex-end',
      }}
      onPress={onPress}
    >
      <Text style={{ color: '#000', fontSize: 12, fontWeight: 'bold' }}>
        Set rule
      </Text>
    </TouchableOpacity>
  );
};

export default StickyButton;
