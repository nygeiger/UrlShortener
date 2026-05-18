import './App.css'
import Container from './components/container/Container'
import Footer from './components/footer/Footer'
import Header from './components/header/Header'

function App() {

  return (
    <div className="flex flex-col min-h-screen">
      <Header/>
      <Container/>
      <Footer/>
    </div>
  )
}

export default App
