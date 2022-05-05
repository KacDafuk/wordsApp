//ADD ROUTES HERE
import {
  BrowserRouter as Router,
  Routes,
  Route,
  HashRouter,
} from "react-router-dom";
import Register from "./components/authentication/register/Register";
import { useAuth } from "./context/ContextAuth";
import "./general/resets.scss";
import Login from "./components/authentication/login/Login";
import Reset from "./components/authentication/reset/Reset";
import Words from "./components/user/words/Words";
import RandomWord from "./components/wordGames/randomWord/RandomWord";
import "./general/classes.scss";
import Quiz from "./components/wordGames/quiz/Quiz";
import WordsAttack from "./components/wordGames/wordsAttack/WordsAttack";
import Navbar from "./components/nav/Navbar";
import WhackWord from "./components/wordGames/whackWord/WhackWord";
function App() {
  const { user } = useAuth();
  return (
    <>
      {user ? <Navbar /> : ""}

      <Routes>
        {user ? (
          <>
            {/* #####################
                           USER ROUTES
                     ##################### */}

            <Route path="/words" element={<Words />} />
            {/* #####################
                        USER ROUTES GAMES
                     ##################### */}
            <Route path="/randomword" element={<RandomWord />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/wordsattack" element={<WordsAttack />} />
            <Route path="/whackword" element={<WhackWord />} />
          </>
        ) : (
          <>
            {/* #####################
                         AUTH ROUTES
                   ##################### */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Login />} />
            <Route path="/reset" element={<Reset />} />
          </>
        )}
      </Routes>
    </>
  );
}

export default App;
