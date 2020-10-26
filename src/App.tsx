import React from 'react';
import logo from './logo.svg';
import './App.css';
import {fromEvent, merge } from "rxjs";
import {
  distinctUntilChanged,
  map,
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

function App() {
  React.useEffect(() => {
    const subscription = merge(
      fromEvent(window, KEY_DOWN_EVENT),
      fromEvent(window, KEY_UP_EVENT),
    ).pipe(
      map((() => {
        let lettersPressed: (string | number)[] = [];
        const keysPressed: {[key: string]: boolean} = {};
        let result = "";

        return (event: Event): string | undefined => {
          const key: string = (event as KeyboardEvent).key;
          const keyCode: number = (event as KeyboardEvent).keyCode || (event as KeyboardEvent).which;

          if (event.type === KEY_UP_EVENT) {
            if ([ALT_KEY, SHIFT_KEY, CONTROL_KEY, META_KEY].includes(key) ) {
              delete keysPressed[key];
            }

            if (Object.keys(keysPressed).length === 0) {
              result = keyCodesToResultString(lettersPressed);
              lettersPressed = [];
            }
          } else if (event.type === KEY_DOWN_EVENT) {
            if ([ALT_KEY, SHIFT_KEY, CONTROL_KEY, META_KEY].includes(key)) {
              keysPressed[key] = true;
              lettersPressed.push(key);
            } else {
              lettersPressed.push(keyCode);
            }
          }

          return result;
        };
      })()),
      distinctUntilChanged()
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
