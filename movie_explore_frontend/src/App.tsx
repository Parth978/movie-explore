import { BrowserRouter, Route, Routes } from "react-router-dom"
import Header from "./components/Header"
import { Home } from "./page/Home"
import { MovieDetail } from "./page/MovieDetails"
import { PersonProfile } from "./page/Profile"
function App() {

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:movieId" element={<MovieDetail/>} />
        <Route path="/person/:personId" element={<PersonProfile/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
