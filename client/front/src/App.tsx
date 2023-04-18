import { useState } from 'react';
import "./App.css"
import Auth from './components/Auth/Auth';
import Chat from './components/Chat/Chat';

const App: React.FC = () => {
	const [isAuthed, setIsAuthed] = useState<boolean>(false)
	const [username, setUsername] = useState<string>('')

	return (
		<div className="App" >
			<div className="container" >
				{isAuthed ? <Chat isAuthed={isAuthed} username={username} setIsAuthed={setIsAuthed} /> : <Auth setIsAuthed={setIsAuthed} setUsername={setUsername} />}
			</div>
		</div>
	);
}

export default App;
