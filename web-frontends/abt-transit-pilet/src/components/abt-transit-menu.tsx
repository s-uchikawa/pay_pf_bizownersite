import * as React from 'react';
import { MessageIds } from '../messages';
import { Link } from 'react-router-dom';
import { UIState } from '../models/ui-state-types';

export interface AbtTransitProps {
  translate(key: MessageIds): string;
  state: UIState;
}

export const AbtTransitMenu: React.FC<AbtTransitProps> = ({
    translate,
    state,
}) => {
    const [initialized, setInitialize] = React.useState(false);

    React.useEffect(() => {
        if (initialized == false) {
            setInitialize(true);
        }
    });

    let style = "abt-tr-flex abt-tr-w-full";
    // if (state.menuEnabled != true) {
    //     style += " abt-tr-pointer-events-none abt-tr-opacity-60";
    // }
    return (
        <Link to="/abt/transit" className={style}>
            <svg 
                className="abt-tr-w-6 abt-tr-h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>

            <span className="abt-tr-mx-3">{translate(MessageIds.labelMenuTile)}</span>
        </Link>
    );
}