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
        subscriber.next(browserHistory.location.pathname);
        browserHistory.listen(state => {
            subscriber.next(state.location.pathname)
        })
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

    observable = (): Observable<AlertMessage[]> =>
        pathnameObservable()
            .pipe(mergeMap(currentPathname =>
                this.state.pipe(
                    map(currState => alertsInCurrentPathname(currState, currentPathname))
                )
            ))

    add = (message: Omit<AlertMessage, '_id'>): void => {

        const currentState = this.state.getValue();

        const newAlert = {...message, _id: uuid()};

        this.state.next([...currentState, newAlert]);

        if(newAlert.autoCloseTimeoutInMs) {
            of(newAlert._id)
                .pipe(delay(newAlert.autoCloseTimeoutInMs))
                .subscribe(({next: this.remove}))
        }
    }

    remove = (id: string): void => {
        const currentState = this.state.getValue();
        this.state.next(
            currentState.filter(({_id}) => _id !== id)
        );
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

        const subscription = alertService.observable().subscribe({next: setAlerts})

        return () => subscription.unsubscribe();
    }, [setAlerts, alertService])

    React.useEffect(() => {

        const subscription = pathnameObservable().subscribe({next: value => console.log(`Current Pathname: ${value}`)})

        return () => subscription.unsubscribe();
    }, [])

    // const alerts = useObservable(() => alertService.observable(), [])

    return (
        <div>
            {alerts.map(message => <Alert key={message._id} {...message}/>)}
        </div>
    )
};