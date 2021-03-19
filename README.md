## RxJS Coding Dojo

### What is RxJS?

RxJS is a library for composing asynchronous and event-based programs by using observable sequences.

RxJS == Lodash for events.

Combines the Observer pattern with the Iterator pattern and functional programming with collections.

Mutable solution:
```javascript
let count = 0;
document.addEventListener('click', () => console.log(`Clicked ${++count} times`));
```

Solution with RxJS
```javascript
import { fromEvent } from 'rxjs';
import { scan } from 'rxjs/operators';

fromEvent(document, 'click')
  .pipe(scan(count => count + 1, 0))
  .subscribe(count => console.log(`Clicked ${count} times`));
```
### Why would you use RxJS?

Code that deals with more than one event or asynchronous computation.

In case of our application we will be using it instead of redux for state managment of our alert service.

It's reactive model integrates well with React.

Example usages:
- Websockets
- UI Events
- Rendering animations
- State managment with BehaviourSubject

### Observable

Observables are lazy Push collections of multiple values.

|          |      Single      |  Multiple    |
|----------|:----------------:|-------------:|
| Pull     |  Function        |   Iterator   |
| Push     |  Promise         |  Observable  |

```javascript
import { Observable } from 'rxjs';

const observable = new Observable(subscriber => {
  subscriber.next(1);
  subscriber.next(2);
  subscriber.next(3);
  setTimeout(() => {
    subscriber.next(4);
    subscriber.complete();
  }, 1000);
});
```

### Observer

What is an Observer? An Observer is a consumer of values delivered by an Observable.

```javascript

const observer = {
  next: x => console.log('Observer got a next value: ' + x),
  error: err => console.error('Observer got an error: ' + err),
  complete: () => console.log('Observer got a complete notification'),
};

observable.subscribe(observer);

```

Observers can be also partial. 

Instead of object you can also pass callbacks as arguments.

### Operators

There are two kinds of operators.

1. Pipeable Operators -
   can be piped to Observables using the syntax observableInstance.pipe(operator()). These include, filter(...), and mergeMap(...).
   
2. Creation Operators - standalone functions that allow creating new Observable.

```javascript
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

of(1, 2, 3) // creation
        .pipe(
          map(x => x + 1) // pipeable
        ).subscribe(v => console.log(`value: ${v}`))

// value: 2
// value: 3
// value: 4
```
### Subscription

A Subscription is an object that represents a disposable resource, usually the execution of an Observable.

```javascript

import { interval } from 'rxjs';

const observable = interval(1000);
const subscription = observable.subscribe(x => console.log(x));
// Later:
// This cancels the ongoing Observable execution which
// was started by calling subscribe with an Observer.
subscription.unsubscribe();

```


### Subjects 

An RxJS Subject is a special type of Observable that allows values to be multicasted to many Observers.

```typescript
import { Subject } from 'rxjs';
 
const subject = new Subject<number>();
 
subject.subscribe({
  next: (v) => console.log(`observerA: ${v}`)
});
subject.subscribe({
  next: (v) => console.log(`observerB: ${v}`)
});
 
subject.next(1);
subject.next(2);
 
// Logs:
// observerA: 1
// observerB: 1
// observerA: 2
// observerB: 2

```

### Scheduler

A scheduler controls when a subscription starts and when notifications are delivered. 

- Data structure, queue tasks.
- Execution context, where and when task is executed.
- Virtual clock. 

Types of schedulers:
- null - Synchronous, recursive. Constant-time operations, or tail recursive.
- queueScheduler - Schedules in the current event frame (Trampoline scheduler). For iteration operations.
- asapScheduler - Micro task queue - same used for promises. Asynchronous conversions.
- asyncScheduler - Uses setInterval. For time based operations.
- animationFrameScheduler - Schedules task just before next browser content repaint. Useful in animations.


### Tasks: Alert Manager

Dojo consists of 9 tasks.

We will be incrementally creating Alert Manager functionality.

This component displays alerts with different intents to end user.

Alerts can be:
   - Closeable by user.
   - Some of them can be autocloseable after specified time elapsed.
   - Some of them can be scoped to current pathname in browser. For example alert from `/great` page cannot be seen after user switches to antoher tab.

To start working on tasks you need to edit `/src/alerts/index.ts`:
```typescript
export {Alerts, alertService} from './AlertsSolution'; // comment out
export type { AlertMessage } from './AlertsSolution';  // comment out

// export {Alerts, alertService} from './AlertsTasks'; // uncomment
// export type { AlertMessage } from './AlertsTasks';  // uncomment
```

Run `npm install & npm run start`, you can now work on tasks located in `/src/alerts/AlertsTasks.tsx`.


### Task 1: Implement pathname observable using browserHistory: BrowserHistory<State>

Tips:
 - `subscriber.next(value)` emits value.
 - `browserHistory.listen((state: State<Update>) => void)` listener let's you check current history in browser including pathname.
 - Before you start using listener, you might want to emit initial value.


### Task 2: Subscribe to pathnameObservable and console log current pathname.

Tips:
 - Subscribe only to next observer.
 - After component is unmounted you want to make sure all resources are freed.
        


### Task 3: Use this.state as Observable.

Tips:
 - Delete placeholder Observable.
 - Use pipe operator map with identity function (`x => x`)



### Task 4: Subscribe to alertService.observable() and set state with next value.

 Tips:
  - Similar to [task 2]

    
### Task 5: Remove code from [task 4] and replace with useObservable hook.

Tips:
 - useObservable accepts two arguments - first is function which returns Observable, second is initial state.

### Task 6: Add new alert to your current state.

Tips:
 - `BehaviourSubject` has method `getValue()` which returns current state.
 - You need to generate unique `_id` for your alert. You can use `uuid()` method.
 - `Subject` has method `next` which allows you to send value to all observers, you need to copy last state add new alert and send updated list.


### Task 7: Remove AlertMessage with given `_id` from state.

Tips:
 - Use `getValue()` to get current state.
 - Update state with `next()` method.


### Task 8: Make Alerts disappear when time since creation is >= autoCloseTimeoutInMs.

Tips:
 - You want this behaviour only for Alerts with field `autoCloseTimeoutInMs` defined.
 - Use `of(...args)` operator to create Observable from Alert `_id`.
 - Use `delay` operator which makes your observable wait for specified time before it's emitted.
 - Use `this.remove` method implemented in [task 7].

### Task 9: For AlertMessages scoped in given pathname, return only those that were created in the current pathname.

Tips:
 - You need to use `pathnameObservable`.
 - Use `mergeMap` pipeable operator to merge pathnameObservable with state.
 - In final `map` operator use `alertsInCurrentPathname` method to return only valid AlertMessages.

### Bibliography / Useful links

 - https://rxjs-dev.firebaseapp.com/
 - https://www.elialotti.com/en/roadmap/rxjs
 - https://github.com/LeetCode-OpenSource/rxjs-hooks
 - https://blog.logrocket.com/rxjs-with-react-hooks-for-state-management/