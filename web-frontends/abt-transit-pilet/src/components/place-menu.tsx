import * as React from 'react';
import { MessageIds } from '../messages';
import { Link } from 'react-router-dom';
import { PlacePageState } from '../models/place-types';

export interface PlaceMenuProps {
  translate(key: MessageIds): string;
  state: PlacePageState;
  getMenuEnebled(): void,
}

export const PlaceMenu: React.FC<PlaceMenuProps> = ({
    translate,
    state,
    getMenuEnebled
}) => {
    const [initialized, setInitialize] = React.useState(false);

    React.useEffect(() => {
        if (initialized == false) {
            getMenuEnebled();
            setInitialize(true);
        }
    });

    let style = "mpp-flex mpp-w-full";
    if (state.menuEnabled != true) {
        style += " mpp-pointer-events-none mpp-opacity-60";
    }
    return (
        <Link to="/places/map" className={style}>
            <svg 
                className="mpp-w-6 mpp-h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>

            <span className="mpp-mx-3">{translate(MessageIds.labelMenuTile)}</span>
        </Link>
    );
}