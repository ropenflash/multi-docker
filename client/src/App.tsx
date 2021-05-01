import "./App.css";
import Fib from "./components/Fib";
import OtherPage from "./components/OtherPage";
import { BrowserRouter, Route, Link } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Link to="/">Home</Link>
        <Link to="/otherpage">Otherpage</Link>
        <Route exact path="/" component={Fib} />
        <Route path="/otherpage" component={OtherPage} />
      </BrowserRouter>
    </div>
  );
}

export default App;
