import * as React from 'react';
import {useObservable} from "rxjs-hooks";
import {Button, Callout, Intent} from "@blueprintjs/core";
import ReactJson from "react-json-view";
import {BehaviorSubject, Observable, of} from "rxjs";
import {v4 as uuid} from 'uuid';
import {delay, map, mergeMap} from "rxjs/operators";
import useConstant from "use-constant";
import {browserHistory} from "../browserHistory";

const pathnameObservable = (): Observable<string> =>
    new Observable<string>(subscriber => {
        /*
         * todo [task 1]: Implement pathname observable using browserHistory: BrowserHistory<State>
         *
         * Tips:
         *  - `subscriber.next(value)` emits value.
         *  - `browserHistory.listen((state: State<Update>) => void)` listener let's you check current history in browser including pathname.
         *  - Before you start using listener, you might want to emit initial value.
         *
         */
    })

const alertsInCurrentPathname = (
    alertMessages: AlertMessage[],
    currentPathname: string
): AlertMessage[] =>
    alertMessages.filter(({pathname}) => (pathname? currentPathname === pathname : true));

export type AlertMessage = {
    _id: string;
    intent: Intent;
    title: string;
    content: {};
    autoCloseTimeoutInMs?: number // undefined means don't close automatically
    pathname?: string // undefined means it's scoped per whole application
}

class AlertService {

    constructor(alertMessages: AlertMessage[] = []) {
        this.state = new BehaviorSubject(alertMessages);
    }

    private state: BehaviorSubject<AlertMessage[]>;

    /*
     * todo [task 3]: Use this.state as Observable.
     *
     * Tips:
     *  - Delete placeholder Observable.
     *  - Use pipe operator map with identity function (`x => x`)
     */

    /*
     * todo [task 9]: For AlertMessages scoped in given pathname, return only those that were created in the current pathname.
     *
     * Tips:
     *  - You need to use `pathnameObservable`.
     *  - Use `mergeMap` pipeable operator to merge pathnameObservable with state.
     *  - In final `map` operator use `alertsInCurrentPathname` method to return only valid AlertMessages.
     */
    observable = (): Observable<AlertMessage[]> => new Observable<AlertMessage[]>();

    add = (message: Omit<AlertMessage, '_id'>): void => {

        /*
         * todo [task 6]: Add new alert to your current state.
         *
         * Tips:
         *  - `BehaviourSubject` has method `getValue()` which returns current state.
         *  - You need to generate unique `_id` for your alert. You can use `uuid()` method.
         *  - `Subject` has method `next` which allows you to send value to all observers, you need to copy last state add new alert and send updated list.
         *
         */

        /*
         * todo [task 8]: Make Alerts disappear when time since creation is >= autoCloseTimeoutInMs.
         *
         * Tips:
         *  - You want this behaviour only for Alerts with field `autoCloseTimeoutInMs` defined.
         *  - Use `of(...args)` operator to create Observable from Alert `_id`.
         *  - Use `delay` operator which makes your observable wait for specified time before it's emitted.
         *  - Use `this.remove` method implemented in [task 7].
         */

    }

    remove = (id: string): void => {

        /*
         * todo [task 7]: Remove AlertMessage with given `_id` from state.
         *
         * Tips:
         *  - Use `getValue()` to get current state.
         *  - Update state with `next()` method.
         */
    }


}

export const alertService = new AlertService();

export const useAlertService = () => useConstant(() => alertService)

const Alert: React.FC<AlertMessage> = ({_id, intent, title, content}) => {
    const alertService = useAlertService();

    const handleRemove = React.useCallback(() => alertService.remove(_id), [_id, alertService])
    return (
        <Callout intent={intent} title={title} >
            <div className="d-flex justify-content-end mb-1"><Button icon='delete' intent={Intent.DANGER} onClick={handleRemove}/></div>
            <ReactJson src={content} theme='monokai' collapsed/>
        </Callout>
    )
}
export const Alerts: React.FC = () => {

    const alertService = useAlertService();
    const [alerts, setAlerts] = React.useState<AlertMessage[]>([]);

    React.useEffect(() => {

        /*
         * todo [task 4]: Subscribe to alertService.observable() and set state with next value.
         *
         * Tips:
         *  - Similar to [task 2]
         */

    }, [setAlerts, alertService])

    /*
     * todo [task 5]: Remove code from [task 4] and replace with useObservable hook.
     *
     * Tips:
     *  - useObservable accepts two arguments - first is function which returns Observable, second is initial state.
     */

    React.useEffect(() => {

        /*
         * todo [task 2]: Subscribe to pathnameObservable and console log current pathname.
         *
         * Tips:
         *  - Subscribe only to next observer.
         *  - After component is unmounted you want to make sure all resources are freed.
         */

    }, [])


    return (
        <div>
            {alerts.map(message => <Alert key={message._id} {...message}/>)}
        </div>
    )
};
