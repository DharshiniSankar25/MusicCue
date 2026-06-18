import {BrowserRouter , Routes , Route} from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Mappage from './pages/Mappage';
function App(){
  return(
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/Register' element={<Register/>}/>
      <Route path='/Login' element={<Login/>}/>
      <Route path='/Map' element={<Mappage/>}/>
    </Routes>
    </BrowserRouter>
  );
}
export default App;