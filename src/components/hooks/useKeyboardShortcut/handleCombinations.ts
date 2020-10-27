import { KEY_DOWN_EVENT, KEY_UP_EVENT } from "../../constants/events";
import { ALT_KEY, CONTROL_KEY, META_KEY, SHIFT_KEY } from "../../constants/keys";

const handleCombinations = (() => {
  let lettersPressed: (string | number)[] = [];
  const keysPressed: {[key: string]: boolean} = {};
  let result: (string | number)[] = [];

  return (event: Event): (string | number)[] | undefined => {
    const key: string = (event as KeyboardEvent).key;
    const keyCode: number = (event as KeyboardEvent).keyCode || (event as KeyboardEvent).which;

    if (event.type === KEY_UP_EVENT) {
      if ([ALT_KEY, SHIFT_KEY, CONTROL_KEY, META_KEY].includes(key) ) {
        delete keysPressed[key];
      }

      if (Object.keys(keysPressed).length === 0) {
        result = lettersPressed;
        lettersPressed = [];
      }
    } else if (event.type === KEY_DOWN_EVENT) {
      if (key.match(/^F\d$/)) {
        lettersPressed.push(key);
        lettersPressed = [];
      } else if ([ALT_KEY, SHIFT_KEY, CONTROL_KEY, META_KEY].includes(key)) {
        if (Object.keys(keysPressed).length === 0) {
          lettersPressed = [];
        }
        keysPressed[key] = true;
        lettersPressed.push(key);
      } else {
        lettersPressed.push(keyCode);
      }
    }

    return result;
  };
})();

export default handleCombinations;
