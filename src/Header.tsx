import * as React from 'react';
import {Alignment, Button, Classes, Navbar} from "@blueprintjs/core";
import {useHistory} from "react-router";

const Header: React.FC = () => {

    const history = useHistory();

    return (
        <Navbar>
            <Navbar.Group align={Alignment.LEFT}>
                <Navbar.Heading>RxJS Dojo</Navbar.Heading>
            </Navbar.Group>
            <Navbar.Group align={Alignment.RIGHT}>
                <Button className={Classes.MINIMAL} icon='home' text='Home Page' onClick={() => history.push("/")} />
                <Button className={Classes.MINIMAL} icon='document' text='Awesome Page' onClick={() => history.push("/awesome")} />
                <Button className={Classes.MINIMAL} icon='hand' text='Great Page' onClick={() => history.push("/great")} />
            </Navbar.Group>
        </Navbar>
    )
};

export default Header;
