import {
  ALT_KEY,
  CONTROL_KEY,
  META_KEY,
  SHIFT_KEY
} from "../../constants/keys";
import { PLUS_SYMBOL } from "../../constants/common";

import { OS_NAMES } from "../../utils";

const mapCombination = (OS: OS_NAMES | undefined) => (combination: string[]): string => {
  const hasControlKey = combination.includes(CONTROL_KEY);
  const hasShiftKey = combination.includes(SHIFT_KEY);
  const hasAltKey = combination.includes(ALT_KEY);
  const hasMetaKey = combination.includes(META_KEY);

  if (hasControlKey && hasShiftKey && OS && [OS_NAMES.LINUX, OS_NAMES.MAC].includes(OS)) {
    const letters = combination.filter(key => ![CONTROL_KEY, SHIFT_KEY].includes(key));

    // is it emoji or just hotkey
    if (letters.join("").match(/^u[\dA-F]{4}$/gi)) {
      try {
        return String.fromCodePoint(parseInt(letters.slice(1).join(""), 16))
      } catch {
        return letters.join(PLUS_SYMBOL);
      }
    }
  } else if (hasAltKey && OS === OS_NAMES.WINDOWS) {
    // can't check it (use macos), so left it empty
  } else if (hasShiftKey && combination.length === 2 && !hasAltKey && !hasMetaKey) {
    const letters = combination.filter(key => ![SHIFT_KEY].includes(key));

    return letters.join("").toUpperCase();
  }

  return combination.join(PLUS_SYMBOL);
};

export default mapCombination;
