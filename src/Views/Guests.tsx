import type * as Types from '../Models/Types';
import * as Enums from '../Models/Enums';
import { useState, useEffect } from 'react';
import * as DatabaseHandler from '../Handlers/DatabaseHandler.tsx';

import '../css/guests.css';

export function Guests() {
    const [isAddingGuestsState, setIsAddingGuestsState] = useState(false);

    return (
        <div id="guests-page" className={`flex flex-col justify-start items-start page ${isAddingGuestsState ? "adding-guests" : ""}`}>
            <div id="guests-page-nav-buttons" className="w-full btn-group">
                <button id="manage-guests-view-nav-button" className="w-1/2 guests-page-nav-button" onClick={_ => { if (isAddingGuestsState) setIsAddingGuestsState(false) }}>
                    Manage Guests
                </button>
                <button id="new-guests-view-nav-button" className="w-1/2 guests-page-nav-button" onClick={_ => { if (!isAddingGuestsState) setIsAddingGuestsState(true) }}>
                    New Guests
                </button>
            </div>

            <div id="manage-guests-view" className="w-full pt-3">
                <div id="guest-list-controls" className="flex w-full justify-start gap-x-3 mb-3">
                    <span id="guest-list-filter">Filter</span>
                    <textarea id="guest-list-search" placeholder="Search Guests"></textarea>
                </div>
                <div id="guest-list">
                    <GuestList />
                </div>
            </div>

            <div id="new-guests-view" className="w-full pt-3">
                <NewGuestsForm />
            </div>
        </div>
    );
}

function GuestStatusOption(props : { key : string, value : string }) {
    const optionId = `guest-status-option-${props.key}`;

    return (
        <option id={optionId} className="guest-status-option" value={props.key}>{props.value}</option>
    );
}

function GuestList() {
    const [guestsState, setGuestsState] = useState(Array<Types.Guest>());
    const [isLoadingState, setIsLoadingState] = useState(true);

    useEffect(() => {
        async function getGuestsFromIndexedDb() {
            const guests = await DatabaseHandler.getGuests();
            setGuestsState(guests);
            setIsLoadingState(false);
        }

        getGuestsFromIndexedDb()
    });

    if (isLoadingState) 
        return (
            <div>Fetching your guests...</div>
        );

    if (guestsState.length === 0) 
        return (
            <div>You can keep track of your wedding guests here. Click the button above to start adding your guests!</div>
        );

    return (
        guestsState.map(guest => <GuestEntry {...guest} key={guest.id}/>)
    );
}

function NewGuestsForm() {
    return (
        <div id="new-guest-form" className="flex flex-col w-full">
            <h4>Guest Name</h4>
            <div className="flex flex-row justify-between align-center gap-x-3">
                <input id="new-guest-first-name" value="" placeholder="First Name" required/>
                <input id="new-guest-last-name" value="" placeholder="Last Name"/>
            </div>

            <h4>Contact Information</h4>
            <div id="guest-contact-information">
                <div className="flex flex-row justify-between align-center gap-x-3" >
                    <input id="guest-email" value="" placeholder="Email" />
                    <input id="guest-phone-number" value="" placeholder="Phone Number" />
                </div>
                <input id="guest-address-line-one" value="" placeholder="Address Line 1"/>
                <input id="guest-address-line-two" value="" placeholder="Address Line 2"/>
                <div className="flex flex-row justify-between align-center gap-x-3">
                    <input id="guest-address-city" value="" placeholder="City" />
                    <input id="guest-address-state" value="" placeholder="State" />
                    <input id="guest-address-zip" value="" placeholder="Zip Code" />
                </div>
            </div>

            <div className="flex flex-row justify-between align-center">
                <label htmlFor="guest-status-select"></label>
                <select id="guest-status-select">
                    { 
                        Object.entries(Enums.GuestStatus).map(([key, value]) => <GuestStatusOption key={key} value={value}/>)
                    }
                </select>
            </div>

            <SaveNewGuestsButton />
        </div>
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

function SaveNewGuestsButton() {
    return (
        <button></button>
    );
}

/*
function useDatabaseState(initial) {
    const [state, setState] =  useState(initial)

    const setDatabase = (newthing) => {
        setState(newthing)
        DatabaseHandler.writeSomething()
    }

    return [state, setDatabase]
}
    */