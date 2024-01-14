import AuthProvider from "./provider/authProvider"
import Routes from "./routes/main"


const App = () => {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  )
}

export default App
