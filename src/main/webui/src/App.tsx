import './App.css';
import './index.css';
import { useAuthStatus } from './resources/AuthStatus.tsx';
import { Header } from "./ui-component/Header.tsx";

function App() {
    const { loading, username, isLoggedIn } = useAuthStatus();

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-violet-100">
            {/* Pass username to Header if needed */}
            <Header />

            <main className="p-4">
                <h1>
                    Welcome to CoPla!
                </h1>

                {loading ? (
                    <p></p>
                ) : isLoggedIn ? (
                    <p>Logged in as: {username}</p>
                ) : (
                    <p>You are not logged in.</p>
                )}
            </main>
        </div>
    );
}

export default App;