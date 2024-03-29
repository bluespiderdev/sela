/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { Dimensions, Image, View, StyleSheet } from 'react-native';
import {
  NativeBaseProvider,
  Box,
  Text,
  Input,
  Link,
  Button,
  HStack,
  useToast,
} from 'native-base';

import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../redux/actions/userAction';
const LoginScreen = () => {

  const navigation = useNavigation();
  const user = useSelector(state => state.user);
  const [formData, setFormData] = useState({
    name: user.name,
    mothername: user.mothername,
    email: user.email,
  });
  useEffect(() => {
    setFormData({
      name: user.name,
      mothername: user.mothername,
      email: user.email,
    });
  }, [user.name, user.mothername, user.email]);
  const handleInputChange = (valueName, value) => {

    setFormData({
      ...formData,
      [valueName]: value,
    });
  };

  const toast = useToast();
  const dispatch = useDispatch();

  const handleNavigateToFrameScreen = () => {
    navigation.navigate('Frame1'); // Navigate to the 'FrameScreen' page
  };
  const handleNavigationToRegisterScreen = () => {
    navigation.navigate('Register');
  };
  const handleSubmit = async () => {
    try {
      const querySnapshot = await firestore().collection('users')
        .where('mothername', '==', formData.mothername)
        .where('name', '==', formData.name)
        .get();
      if (!querySnapshot.empty) {
        handleNavigateToFrameScreen();
        const payload = {
          userID: user.userID,
          name: formData.name,
          mothername: formData.mothername,
          email: formData.email,
        };
        dispatch(setUserData(payload));
      }
      else {
        toast.show({
          render: () => {
            return <Box bg="emerald.500" px="2" py="1" rounded="sm" mb={5}>
              This user does not exit!
            </Box>;
          },
        });
      }
    } catch {
      toast.show({
        render: () => {
          return <Box bg="emerald.500" px="2" py="1" rounded="sm" mb={5}>
            Please Fill Inputs Again!
          </Box>;
        },
      });
    }
  };

  return (
    <NativeBaseProvider>
      <View style={styles.container}>
        <Image
          source={require('../Image/bg_reg.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
          alt="background"
        />
        <View style={styles.safearea}>
          <Text style={styles.text}>שם פרטי</Text>
          <Input
            style={styles.input}
            onChangeText={(text) => handleInputChange('name', text)}
            variant="unstyled"
            value={formData.name}
            placeholder="שם פרטי"
          />
          <Text style={styles.text}>שם האם</Text>
          <Input
            style={styles.input}
            onChangeText={(text) => handleInputChange('mothername', text)}
            variant="unstyled"
            value={formData.mothername}
            placeholder="שם האם"
          />

          <Text style={styles.text}>אמייל (אופציונלי)</Text>
          <Input
            style={styles.input}
            variant="unstyled"
            placeholder="אמייל (אופציונלי)"
            onChangeText={(text) => handleInputChange('email', text)}
            value={formData.email}
          />

          <HStack justifyContent="center" marginTop="10">
            <Button
              width="100%"
              backgroundColor="#560FC9"
              size="lg"
              rounded="lg"
              onPressIn={handleSubmit}
            >
              המשך
            </Button>
          </HStack>
          <HStack justifyContent="center" alignItems="center">
            <Text
              fontSize="md"
              color="coolGray.600"
              _dark={{
                color: 'warmGray.200',
              }}>
              I'm a new user.
            </Text>
            <Link
              style={styles.signup}
              _text={{
                fontSize: 'md',
                fontWeight: '500',
                color: 'indigo.500',
              }}
              alignSelf="flex-end"
              mt="1"
              onPress={handleNavigationToRegisterScreen}>
              sign up
            </Link>
          </HStack>
        </View>
      </View>
    </NativeBaseProvider>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    flex: 1,
    position: 'absolute',
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  safearea: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    bottom: 0,
    width: '100%',
    padding: 20,
    position: 'absolute',
    justifyContent: 'flex-end',
  },
  input: {
    padding: 10,
    borderRadius: 27,
    backgroundColor: '#F1E6FF',
    color: '#D6B7FF',
    paddingHorizontal: 10,
  },
  text: {
    fontSize: 14,
    marginTop: 10,
    marginBottom: 10,
    marginRight: 20,
    color: '#1E0050',
  },
  signup: {
    fontSize: 14,
    marginTop: 20,
    marginLeft: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
});
