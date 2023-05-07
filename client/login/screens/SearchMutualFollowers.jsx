import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {} from "../redux/messageActions"

const MutualFollowersScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mutualFollowers, setMutualFollowers] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    if (searchQuery) {
      
    }
  }, [searchQuery]);

  const handleFollowerPress = (follower) => {
    navigation.navigate('Conversation', { follower });
  };

  const renderFollowerItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleFollowerPress(item)}>
      <View>
        <Text>{item.name}</Text>
        <Text>{item.username}</Text>
        {/* possibly aavatar too */}
      </View>
    </TouchableOpacity>
  );

  return (
    <View>
      <TextInput
        placeholder="Search for mutual followers"
        value={searchQuery}
        onChangeText={(query) => setSearchQuery(query)}
      />
      <FlatList
        data={mutualFollowers}
        keyExtractor={(follower) => follower.id.toString()}
        renderItem={renderFollowerItem}
      />
    </View>
  );
};

export default MutualFollowersScreen;
