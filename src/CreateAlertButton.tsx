import * as React from 'react';
import {Button, ButtonGroup, Intent} from "@blueprintjs/core";
import {alertService} from "./alerts";
import {useHistory} from "react-router";

let alertCount = 0

const getRandomIntent = () => {
    const id = (Math.floor(Math.random() * 100) + 1) % 5;

    const mapping: {[key: number]: Intent} = {
        0: Intent.DANGER,
        1: Intent.NONE,
        2: Intent.PRIMARY,
        3: Intent.SUCCESS,
        4: Intent.WARNING
    }
    return mapping[id];
}

const sendAlert = () =>
    alertService.add({
        title: `Random alert number: ${++alertCount}`,
        intent: getRandomIntent(),
        content: {coolContent: "something really cool"}
    })
const sendAlertWithAutoClose = () =>
    alertService.add({
        title: `Random alert number: ${++alertCount}`,
        intent: getRandomIntent(),
        content: {coolContent: "something really cool"},
        autoCloseTimeoutInMs: 3000
    })

const sendAlertWithPathname = (pathname: string) =>
    alertService.add({
        title: `Random alert number: ${++alertCount}`,
        intent: getRandomIntent(),
        content: {coolContent: "something really cool"},
        pathname
    })

export const CreateAlertButton: React.FC = () => {
    const history = useHistory();

    return (
        <ButtonGroup className='Alert-button'>
            <Button onClick={sendAlert}>Create Alert</Button>
            <Button onClick={sendAlertWithAutoClose}>Create Autocloseable Alert</Button>
            <Button onClick={() => sendAlertWithPathname(history.location.pathname)}>Create Pathname Scoped Alert</Button>
        </ButtonGroup>
    );
}