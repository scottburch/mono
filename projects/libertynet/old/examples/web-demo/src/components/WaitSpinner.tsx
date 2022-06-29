import React from "react";
import {Spinner} from "react-bootstrap";

export const WaitSpinner: React.FC<{visible: boolean}> = ({visible}) =>
    visible ? (
        <span style={{paddingRight:10}}>
            <Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
            />
            </span>
        ) : null;


