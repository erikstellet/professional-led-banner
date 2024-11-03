import { ReactNode } from "react";
import { Pressable, StyleSheet } from "react-native";

import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  FadeIn,
  FadeOut,
  runOnJS,
  SlideInDown,
  SlideOutDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const OVERDRAG = 20;
const HEIGHT = 340;

interface Props {
  children: ReactNode;
  visible: boolean;
  setVisible: (param: boolean) => void;
};

function BottomSheet({ children, setVisible, visible }: Props) {
  const offset = useSharedValue(0);

  function toggleSheet() {
    offset.value = 0;
    setVisible(!visible);
  };

  const pan = Gesture.Pan()
    .onChange((event) => {
      const offsetDelta = event.changeY + offset.value;
      const clamp = Math.max(-OVERDRAG, offsetDelta);

      offset.value = offsetDelta > 0 ? offsetDelta : withSpring(clamp);
    })
    .onFinalize(() => {
      if (offset.value < HEIGHT / 3) {
        offset.value = withSpring(0);
      } else runOnJS(toggleSheet)();
    });

  const translateY = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }],
  }));

  return (
    visible && (
      <>
        <AnimatedPressable
          entering={FadeIn}
          exiting={FadeOut}
          onPress={toggleSheet}
          style={styles.buttonOverlay}
        />

        <GestureDetector gesture={pan}>
          <Animated.View
            entering={SlideInDown.springify().damping(16)}
            exiting={SlideOutDown}
            style={[styles.content, translateY]}
          >
            { children }
          </Animated.View>
        </GestureDetector>
      </>
    )
  );
};

const styles = StyleSheet.create({
  buttonOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,

    backgroundColor: "rgba(0, 0, 0, .4)"
  },
  content: {
    alignItems: "center",
    bottom: -OVERDRAG * 1.1,
    height: HEIGHT,
    justifyContent: "center",

    padding: 24,
    position: "absolute",
    width: "100%",
    zIndex: 1,

    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  }
});

export default BottomSheet;