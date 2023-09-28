import {Text} from "./text";
import {Icon} from "./icons";

export const Logo: React.FC = () => (
  <div className="flex items-center">
    <Text className="font-bold text-2xl">Image</Text>
    <Icon.Logo />
    <Text className="font-bold text-2xl">Keeper</Text>
  </div>
);
