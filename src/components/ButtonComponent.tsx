import { Button, ButtonProps } from "react-native";

function ButtonComponent({ title, onPress }: ButtonProps) {
  return (
    <Button title={title} onPress={onPress} />
  );
};

export default ButtonComponent;