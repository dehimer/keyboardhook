import React from "react";
import { fromEvent, merge } from "rxjs";

import {
  distinctUntilChanged,
  distinctUntilKeyChanged,
  filter,
  map
} from "rxjs/operators";
import {
  detectOSName,
  inputIsNotNullOrUndefined,
  keyCodesToResultString,
  OS_NAMES
} from "../../utils";

import {
  KEY_DOWN_EVENT,
  KEY_UP_EVENT
} from "../../constants/events";

import handleCombinations from "./handleCombinations";
import mapCombination from "./mapCombination";

const useKeyboardShortcut = () => {
  const OS: OS_NAMES | undefined = detectOSName();
  const [keyboardShortcut, setKeyboardShortcut] = React.useState<string>("");

  React.useEffect(() => {
    const subscription = merge(
      fromEvent<KeyboardEvent>(window, KEY_DOWN_EVENT).pipe(
        distinctUntilKeyChanged<KeyboardEvent>("code")
      ),
      fromEvent<KeyboardEvent>(window, KEY_UP_EVENT),
    ).pipe(
      map(handleCombinations),
      distinctUntilChanged(),
      filter(inputIsNotNullOrUndefined),
      filter(rawCombination => rawCombination.length !== 0),
      map((
        rawCombination: (string | number)[]): string[] => keyCodesToResultString(rawCombination)
      ),
      map(mapCombination(OS))
    )
      .subscribe((shortcut) => {
        setKeyboardShortcut(shortcut);
      });
    return subscription.unsubscribe;
  }, [OS]);

  return keyboardShortcut;
}

export default useKeyboardShortcut;
