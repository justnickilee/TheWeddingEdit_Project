import uuid from 'react-uuid';
import type * as Types from '../Models/Types';
import { useState, type FormEvent } from 'react';
import * as DatabaseHandler from '../Handlers/DatabaseHandler.tsx';
import { useNavigate } from 'react-router-dom';

export function NewWedding() {
        const defaultWedding : Types.Wedding = {
        id: uuid(),
        title: "Our Wedding"
    };

    const [weddingState, setWeddingState] = useState(defaultWedding);
    const navigate = useNavigate();

    async function submitWeddingInfo(e: FormEvent) {
        e.preventDefault()
        try {
            const result = await DatabaseHandler.createWedding(weddingState);

            if (!result.wasSuccessful) {
                alert('Failed to create event. Please double check the values entered or try again later.');
                return;
            }

            navigate('/');
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="flex flex-col justify-start items-center page">
            <h1 className="pb-2">Welcome and Congratulations!</h1>

            <form id="newWeddingForm" className="mt-4 w-full" onSubmit={submitWeddingInfo}>
                <div className="flex flex-col items-center mb-10">
                    <label htmlFor="weddingTitleInput" className="mb-2">What would you like to call your wedding?</label>
                    <input id="weddingTitleInput" type="text" value={weddingState.title} 
                        onChange={e => setWeddingState(prevState => ({...prevState, title: e.target.value}))} required />
                </div>

                <div className="flex flex-col items-center mb-10">
                    <label htmlFor="weddingDate">When is your wedding?</label>
                    <small className="mb-2">It's okay if you don't have a date set yet!</small>
                    <input id="weddingDate" type="date" value={weddingState.date ?? ''} className="w-64"
                        onChange={e => setWeddingState(prevState => ({...prevState, date: e.target.value}))} />
                </div> 

                <div className="flex flex-row justify-center items-center mb-10 gap-6">
                    <div className="flex flex-col items-center">
                        <label htmlFor="usersNameInput" className="mb-2">Your Name</label>
                        <input id="usersNameInput" type="text" value={weddingState.usersName}
                            onChange={e => setWeddingState(prevState => ({...prevState, usersName: e.target.value}))} required />
                    </div>
                    <div className="flex flex-col items-center">
                        <label htmlFor="partnersNameInput" className="mb-2">Partner's Name</label>
                        <input id="partnersNameInput" type="text" value={weddingState.partnersName} 
                            onChange={e => setWeddingState(prevState => ({...prevState, partnersName: e.target.value}))} required />
                    </div>
                </div>

                <button id="createWeddingBtn" type="submit" className="btn bg-success">
                    Let's Get Started!
                </button>
            </form>
        </div>
    );
}