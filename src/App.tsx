import React from 'react';
import logo from './logo.svg';
import './App.css';
import {fromEvent, scheduled, merge, Observable, combineLatest} from "rxjs";
import {
  distinctUntilChanged,
  map,
} from "rxjs/operators";

function App() {
  React.useEffect(() => {
    const subscription = merge(
      fromEvent(window, "keydown"),
      fromEvent(window, "keyup"),
    ).pipe(
      map((() => {
        let lettersPressed: number[] = [];
        const keysPressed: {[key: string]: boolean} = {};

        return (event: Event): string => {
          // console.log(event);
          const key: string = (event as KeyboardEvent).key;
          const keyCode: number = (event as KeyboardEvent).keyCode || (event as KeyboardEvent).which;
          // const { altKey, shiftKey, ctrlKey } = (event as KeyboardEvent);

          if (event.type === "keyup") {
            if (["Alt", "Shift", "Control", "Meta"].includes(key)) {
              lettersPressed = [];
              delete keysPressed[key];
            }
          } else if (event.type === "keydown") {
            if (["Alt", "Shift", "Control", "Meta"].includes(key)) {
              keysPressed[key] = true;
              lettersPressed = [];
            } else {
              lettersPressed.push(keyCode);
            }
          }

          return Object.keys(keysPressed).concat(lettersPressed.map(keyCode => String.fromCharCode(keyCode).toLowerCase())).join("+");
        };
      })()),
      distinctUntilChanged()
    )
      .subscribe((event) => {
        console.log(event);
        // console.log(event.type, (event as KeyboardEvent).key);
    });

    // const subscription = fromEvent(document, 'keydown')
    //   .subscribe((event) => {
    //   console.log(event);
    // });

    // const subscription = merge(
    //   fromEvent(document, 'keydown'),
    //   fromEvent(document, 'keyup')
    // ).pipe(
    //   distinctUntilChanged((a, b) => {
    //     return (a as KeyboardEvent).key === (b as KeyboardEvent).key && a.type === b.type;
    //   }),
    //   share()
    // )
    //   .subscribe((event) => {
    //   console.log(event);
    // });

    // keyPresses.subscribe((ctrlpress) => {
    //   this.holdingCtrl = ctrlpress.type === 'keydown';
    // });

    // const subscription = fromEvent(window, "keyup").pipe(
    //   bufferTime(700)
    // ).subscribe(event => {
    //   console.log(event);
    // });

    // return unsubscribe method to execute when component unmounts
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
