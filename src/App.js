import './App.css';
import LoginForm from './component/Login/Login';
import { BrowserRouter, Route } from 'react-router-dom';
import DataList from './component/DataList/DataList';

const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Route exact path="/" component={LoginForm} />
        <Route path="/DataGrid/DataList" exact component={DataList} />
      </div>
    </BrowserRouter>
  );
}

export default App;
