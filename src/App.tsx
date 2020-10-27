import React from 'react';
import './App.css';
import {fromEvent, merge} from "rxjs";
import {distinctUntilChanged, distinctUntilKeyChanged, filter, map} from "rxjs/operators";
import {detectOSName, OS_NAMES} from "./utils";

const KEY_DOWN_EVENT = "keydown";
const KEY_UP_EVENT = "keyup";

const ALT_KEY = "Alt";
const SHIFT_KEY = "Shift";
const CONTROL_KEY = "Control";
const META_KEY = "Meta";

const NUMBER_TYPE = "number";

const PLUS_SYMBOL = "+";

function inputIsNotNullOrUndefined<T>(input: null | undefined | T): input is T {
  return input !== null && input !== undefined;
}

const keyCodesToResultString = (lettersPressed: (number | string)[]): string[] =>
  lettersPressed.map(
    key => {
      if (typeof key === NUMBER_TYPE) {
        return String.fromCharCode(key as number).toLowerCase();
      }

      return key as string;
    }
  );

function App() {
  const OS: OS_NAMES | undefined = detectOSName();

  const [text, setText] = React.useState<string[]>([]);

  React.useEffect(() => {
    const subscription = merge(
      fromEvent<KeyboardEvent>(window, KEY_DOWN_EVENT).pipe(
        distinctUntilKeyChanged<KeyboardEvent>("code")
      ),
      fromEvent<KeyboardEvent>(window, KEY_UP_EVENT),
    ).pipe(
      map((() => {
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
      })()),
      distinctUntilChanged(),
      filter(inputIsNotNullOrUndefined),
      map((
        rawCombination: (string | number)[]): string[] => keyCodesToResultString(rawCombination)
      ),
      map((combination: string[]): string => {
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
        } else if (hasShiftKey && combination.length === 2) {
          const letters = combination.filter(key => ![SHIFT_KEY].includes(key));

          return letters.join("").toUpperCase();
        }

        return combination.join(PLUS_SYMBOL);
      })
    )
      .subscribe((shortcut) => {
        setText((prevText) => {
          return prevText.concat(shortcut)
        });
    });
    return subscription.unsubscribe;
  }, [OS]);

  return (
    <div className="App">
      {text.map((t, index) => (<div key={index} style={{ padding: "5px" }}>{t}</div>))}
    </div>
  );
}

export default App;
