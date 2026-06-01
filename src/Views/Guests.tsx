import type * as Types from '../Models/Types';
import * as Enums from '../Models/Enums';
import { useState, useEffect } from 'react';
import * as DatabaseHandler from '../Handlers/DatabaseHandler.tsx';
import uuid from 'react-uuid';

import '../css/guests.css';

export function Guests() {
    const [isAddingGuestsState, setIsAddingGuestsState] = useState(false);
    const [inGuestSelectModeState, setInGuestSelectModeState] = useState(false);

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
                    <input id="enter-guest-select-mode" type="checkbox" checked={inGuestSelectModeState} onChange={e => setInGuestSelectModeState(e.target.checked)}/>
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
        guestsState.map(guest => <GuestEntry guest={guest} key={guest.id}/>)
    );
}

function GuestEntry(props : { guest : Types.Guest }) {
    const guest = props.guest;
    const guestName = `${guest.firstName}${!guest.lastName ? "" : " " + guest.lastName}`;

    return (
        <div data-guest-id={guest.id} className="guest-entry flex justify-between w-full">
            <span>{guestName}</span>
        </div>
    );
}

function NewGuestsForm() {
    const blankGuest : Types.Guest = {
            id: uuid(),
            firstName: "",
            lastName: "",
            contactInformation: {
                email: "",
                phone: "",
                address: {
                    addressLineOne: "",
                    addressLineTwo: "",
                    city: "",
                    state: "",
                    zip: ""
                }
            },
            status: Enums.GuestStatus.None
        };

    const [newGuestState, setNewGuestState] = useState(blankGuest);

    function validatedSetNewGuestState(guest : Types.Guest) {
        if (!guest.firstName) {
            console.log("Invalid first name entry. The first name field is required.");
            return;
        }

        setNewGuestState(guest);
    }

    async function saveGuests() {
        if (!newGuestState.firstName) {
            console.log("Invalid first name entry. The first name field is required.");
            // TODO: display error message to the user explaining what's wrong
            return;
        }

        const validatedAddress = newGuestState.contactInformation?.address?.addressLineOne 
            ? newGuestState.contactInformation?.address 
            : undefined;

        const validatedGuest = ({...newGuestState, contactInformation: {...newGuestState.contactInformation, address: validatedAddress} });

        const result = await DatabaseHandler.addGuest(validatedGuest);

        setNewGuestState(blankGuest);

        //TODO: alert success or failure
    }

    return (
        <div id="new-guest-form" className="flex flex-col w-full">
            <label className="justify-center mb-3">Guest Name</label>
            <div className="flex flex-row justify-between align-center gap-x-3 mb-10">
                <input type="text" id="new-guest-first-name" className="w-1/2" value={newGuestState.firstName} placeholder="First Name (required)" required 
                    onChange={e => validatedSetNewGuestState({...newGuestState, firstName: e.target.value})}/>
                <input type="text" id="new-guest-last-name" className="w-1/2" value={newGuestState.lastName} placeholder="Last Name"
                    onChange={e => setNewGuestState(prevState => ({...prevState, lastName: e.target.value}))}/>
            </div>

            <label className="justify-center mb-3">Contact Information</label>
            <div id="guest-contact-information" className="mb-10">
                <div className="flex flex-row justify-between align-center gap-x-3 mb-3" >
                    <input type="text" id="guest-email" className="w-1/2" value={newGuestState.contactInformation?.email} placeholder="Email" 
                        onChange={e => setNewGuestState(prevState => ({...prevState, contactInformation: {...prevState.contactInformation, email: e.target.value}}))}/>
                    <input type="text" id="guest-phone-number" className="w-1/2" value={newGuestState.contactInformation?.phone} placeholder="Phone Number" 
                        onChange={e => setNewGuestState(prevState => ({...prevState, contactInformation: {...prevState.contactInformation, phone: e.target.value}}))}/>
                </div>
                <input type="text" id="guest-address-line-one" className="w-full mb-3" value={newGuestState.contactInformation?.address?.addressLineOne} placeholder="Address Line 1"
                    onChange={e => setNewGuestState(prevState => ({...prevState, contactInformation: {...prevState.contactInformation, address: {...prevState.contactInformation?.address, addressLineOne: e.target.value}}}))}/>
                <input type="text" id="guest-address-line-two" className="w-full mb-3" value={newGuestState.contactInformation?.address?.addressLineTwo} placeholder="Address Line 2"
                    onChange={e => setNewGuestState(prevState => ({...prevState, contactInformation: {...prevState.contactInformation, address: {...prevState.contactInformation?.address, addressLineOne: prevState.contactInformation?.address?.addressLineOne ?? "", addressLineTwo: e.target.value}}}))}/>
                <div className="flex flex-row justify-between align-center gap-x-3">
                    <input type="text" id="guest-address-city" className="w-1/3" value={newGuestState.contactInformation?.address?.city} placeholder="City" 
                        onChange={e => setNewGuestState(prevState => ({...prevState, contactInformation: {...prevState.contactInformation, address: {...prevState.contactInformation?.address, addressLineOne: prevState.contactInformation?.address?.addressLineOne ?? "", city: e.target.value}}}))}/>
                    <input type="text" id="guest-address-state" className="w-1/3" value={newGuestState.contactInformation?.address?.state} placeholder="State" 
                        onChange={e => setNewGuestState(prevState => ({...prevState, contactInformation: {...prevState.contactInformation, address: {...prevState.contactInformation?.address, addressLineOne: prevState.contactInformation?.address?.addressLineOne ?? "", state: e.target.value}}}))}/>
                    <input type="text" id="guest-address-zip" className="w-1/3" value={newGuestState.contactInformation?.address?.zip} placeholder="Zip Code" 
                        onChange={e => setNewGuestState(prevState => ({...prevState, contactInformation: {...prevState.contactInformation, address: {...prevState.contactInformation?.address, addressLineOne: prevState.contactInformation?.address?.addressLineOne ?? "", zip: e.target.value}}}))}/>
                </div>
            </div>

            <div className="flex flex-row justify-start align-center mb-10 gap-x-3">
                <label htmlFor="guest-status-select">Guest Status</label>
                <select id="guest-status-select" value={Object.keys(Enums.GuestStatus).find((key) => Enums.GuestStatus[key as keyof typeof Enums.GuestStatus] === newGuestState.status)} onChange={e => setNewGuestState(prevState => ({...prevState, status: Enums.GuestStatus[e.target.value as keyof typeof Enums.GuestStatus]}))}>
                    { 
                        Object.entries(Enums.GuestStatus).map(([key, value]) => <GuestStatusOption key={key} enumKey={key} value={value}/>)
                    }
                </select>
            </div>

            <button className="btn bg-success" type="button" onClick={saveGuests}>Save Guest</button>
        </div>
    );
}

function GuestStatusOption(props : { enumKey : string, value : string }) {
    const optionId = `guest-status-option-${props.enumKey}`;

    return (
        <option id={optionId} className="guest-status-option" value={props.enumKey}>{props.value}</option>
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