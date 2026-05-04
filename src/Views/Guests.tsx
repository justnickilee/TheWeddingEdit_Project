import type * as Types from '../Models/Types';
import { useState } from 'react';
import * as DatabaseHandler from '../Handlers/DatabaseHandler.tsx';

export function Guests() {
    return (
        <div className="flex flex-col justify-start items-start page">
            <h3>Wedding Guests</h3>
            <div id="guest-list-controls" className="flex justify-between mb-3">
                <button id="add-guests-btn" className="btn btn-primary">Add Guests</button>
                <div className="flex gap-x-3">
                    <span id="guest-list-filter">Filter</span>
                    <textarea id="guest-list-search" placeholder="Search Guests"></textarea>
                </div>
            </div>
            <div id="guest-list">
                <GuestList />
            </div>
        </div>);

    async function GuestList() {
        const [guestsState, setGuestsState] = useState(await DatabaseHandler.getGuests());

        if (guestsState.length === 0) {
            return (
                <div>You can keep track of your wedding guests here. Click the button above to start adding your guests!</div>
            );
        }

        return (
            guestsState.map(guest => <GuestEntry {...guest}/>)
        );
    }

    function GuestEntry(guest : Types.Guest) {
        const guestName = `${guest.firstName}${!guest.lastName ? "" : " " + guest.lastName}`;

        return (
            <div data-guest-id={guest.id} className="guest-entry flex justify-between w-full">
                <span>{guestName}</span>
            </div>
        );
    }
}