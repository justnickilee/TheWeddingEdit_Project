import type * as Types from '../Models/Types'
import { useNavigate } from 'react-router-dom'
import * as DatabaseHandler from '../Handlers/DatabaseHandler.tsx'

export function Home(props: { wedding: Types.Wedding }) {
    const wedding = props.wedding;

    return (
        <div className="flex flex-col justify-start items-start page">
            <h1>{wedding.title}</h1>
            <ResetButton />
        </div>
    );

    function ResetButton() {
        const navigate = useNavigate(); 

        async function resetWedding() {
            if (!wedding)
                return;

            const result = await DatabaseHandler.deleteWedding(wedding);

            if (!result.wasSuccessful) {
                alert('An error occurred while attempting to reset.');
                return;
            }
                
            navigate('/newWedding');
        }

        return (
            <button id="restart-btn" type="button" className="btn bg-danger"
                onClick={_ => resetWedding()}>Restart</button>
        );
    }
}