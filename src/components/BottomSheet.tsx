import { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

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
const HEIGHT = 280;

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
            entering={SlideInDown}
            exiting={SlideOutDown}
            style={[styles.bottomSheet, translateY]}
          >
            <View style={styles.indicator}>
              <Text style={styles.indicatorLabel}>Promp de Comando</Text>
              <Text style={styles.indicatorLabel}>x</Text>
            </View>

            <View style={styles.content}>
              { children }
            </View>
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
  },
  bottomSheet: {
    alignItems: "center",
    bottom: 0,
    height: HEIGHT,
    justifyContent: "center",

    paddingTop: 8,
    position: "absolute",
    width: "100%",
    zIndex: 1,

    backgroundColor: "#414141",
    borderColor: "#414141",
    borderBottomWidth: 0,
    boxShadow: "0px 0px 8px 8px rgba(0, 0, 0, .1)"
  },
  indicator : {
    alignSelf: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    height: 24,

    justifyContent: "space-around",
    marginLeft: 8,
    width: "50%",

    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderColor: "gray",
    backgroundColor: "#000",
  },
  indicatorLabel : {
    alignSelf: "flex-start",
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Inconsolata-Medium",
  },
  content: {
    alignItems: "flex-start",
    flex: 1,
    justifyContent: "flex-start",
    padding: 16,

    width: "100%",

    backgroundColor: "#000",
  }
});

export default BottomSheet;