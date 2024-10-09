import { MenuRoutes } from './MenuPages/menuRoutes'
import { BrowserRouter, Routes } from 'react-router-dom'
import { NotificationProvider } from './globalPops/useNotification'
import { HomeRoutes } from './HomePages/HomeRoutes'
import { Provider } from 'react-redux';
import { store, persistor } from './Redux/reduxStore';
import { PersistGate } from 'redux-persist/integration/react';

function App() {

  return (
    <NotificationProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter>
            <Routes>
              {MenuRoutes}
              {HomeRoutes}
            </Routes>
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </NotificationProvider>

  )
}

export default App
