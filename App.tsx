import { useRef, useState } from 'react';
import {
  Text,
  TextInput,
  Animated,
  StyleSheet,
} from 'react-native';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import BottomSheet from './src/components/BottomSheet';
import ButtonComponent from './src/components/ButtonComponent';

export default function App() {
  const slideAnim = useRef(new Animated.Value(-600)).current;

  const [text, setText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const startAnimation = () => {
    setIsAnimating(true);
    Animated.loop(
      Animated.timing(slideAnim, {
        toValue: 600,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
  };

  const closeModal = () => {
    setModalVisible(false);
    startAnimation();
  };

  const openModal = () => {
    setModalVisible(true);
    setIsAnimating(false);
    slideAnim.setValue(-300);
  };

  const getRandomColor = () => {
    const colors = ['#FF6347', '#FFD700', '#32CD32', '#1E90FF', '#FF69B4'];

    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <BottomSheet visible={modalVisible} setVisible={setModalVisible}>
          <TextInput
            style={styles.input}
            placeholder="Digite algo..."
            value={text}
            onChangeText={setText}
          />

          <ButtonComponent title="Começar" onPress={closeModal} />
        </BottomSheet>

      {!modalVisible && (
        <>
          {isAnimating && (
            <Animated.View
              style={[
                styles.ledContainer,
                { transform: [{ translateY: slideAnim }, { rotate: '90deg' }] }
              ]}
            >
              {text.split('').map((char, index) => (
                <Text
                  key={index}
                  style={[styles.ledText, { color: getRandomColor() }]}
                >
                  {char}
                </Text>
              ))}
            </Animated.View>
          )}

          <ButtonComponent title="Reabrir Modal" onPress={openModal} />
        </>
      )}
    </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#FFF',
  },
  input: {
    height: 50,
    width: '100%',
    padding: 16,
    marginBottom: 20,

    fontSize: 18,

    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 12,
    backgroundColor: '#D9D9D9',
  },
  ledContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  ledText: {
    fontSize: 64,
    fontWeight: 'bold',
    marginHorizontal: 2,
  },
});