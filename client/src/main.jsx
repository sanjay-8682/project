import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from './redux/user/store.js'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <PersistGate persistor={persistor}>
  <Provider loading={null} store={store}>
    <App />
    </Provider>
    </PersistGate>
  </BrowserRouter>,
)
