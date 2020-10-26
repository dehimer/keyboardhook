import React from 'react';
import logo from './logo.svg';
import './App.css';
import { fromEvent, merge } from "rxjs";
import {
  distinctUntilChanged,
  map,
  filter, distinctUntilKeyChanged
} from "rxjs/operators";

const KEY_DOWN_EVENT = "keydown";
const KEY_UP_EVENT = "keyup";

const ALT_KEY = "Alt";
const SHIFT_KEY = "Shift";
const CONTROL_KEY = "Control";
const META_KEY = "Meta";

const NUMBER_TYPE = "number";

const PLUS_SYMBOL = "+";

const keyCodesToResultString = (lettersPressed: (number | string)[]): string =>
  lettersPressed.map(
    key => {
      if (typeof key === NUMBER_TYPE) {
        return String.fromCharCode(key as number).toLowerCase();
      }

      return key;
    }
  )
    .join(PLUS_SYMBOL);

function inputIsNotNullOrUndefined<T>(input: null | undefined | T): input is T {
  return input !== null && input !== undefined;
}

function App() {
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
      map((combination: (string | number)[]): string => {
        // Alt only
        // Ctrl + Shift
          // letters start from u
            // try to map utf


        return keyCodesToResultString(combination);
      })
    )
      .subscribe((shortcut) => {
        console.log(shortcut);
    });
    return subscription.unsubscribe;
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
    </div>
  );
}

export default App;
