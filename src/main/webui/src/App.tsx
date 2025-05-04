import './App.css'
import './index.css'
import {Header} from "./ui-component/header.tsx";

function App() {

    return (

        <div className="min-h-screen bg-gradient-to-b from-white to-violet-100">
            <Header />

            <main className="p-4">
                <h1>
                    Welcome to CoPla !
                </h1>

            </main>
        </div>
    )
}

export default App