import { Link } from 'react-router-dom'

export function TopBar() {
    return (
        <div id="topbar" className="flex flex-row justify-between items-center">
            <h2>TheWeddingEdit</h2>
            <div id="topbar-nav-items" className="h-full flex flex-row justify-end items-end gap-6">
                <Link to="/">
                    Home
                </Link>
                <Link to="/guests">
                    Guests
                </Link>
            </div>
        </div>
    )
}