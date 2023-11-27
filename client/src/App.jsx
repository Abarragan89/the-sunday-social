/* eslint-disable no-unused-vars */
import HomePage from './pages/homePage'
import Header from './components/Header'
import ProfilePage from './pages/profilePage'
import Messages from './pages/messages'
import Friends from './pages/friends'
import FriendProfilePage from './pages/friendProfile'
import ResetPasswordPage from './pages/resetPasswordPage'
import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {

  const [triggerRefreshAmongPages, setTriggerRefreshAmongPages] = useState(false)

  return (
    <>
      <BrowserRouter>
      <Header triggerRefreshAmongPages={triggerRefreshAmongPages} />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/profile' element={<ProfilePage
            triggerRefreshAmongPages={triggerRefreshAmongPages}
            setTriggerRefreshAmongPages={setTriggerRefreshAmongPages}
           />} />
          <Route path='/messages/:chatId?' element={<Messages
            triggerRefreshAmongPages={triggerRefreshAmongPages}
            setTriggerRefreshAmongPages={setTriggerRefreshAmongPages}
           />} />
          <Route path='/friends' element={<Friends 
            triggerRefreshAmongPages={triggerRefreshAmongPages}
            setTriggerRefreshAmongPages={setTriggerRefreshAmongPages}
          />} />
          <Route path='/friendProfile/:friendId' element={<FriendProfilePage />} />
          <Route path='/passwordReset/:tokenId' element={<ResetPasswordPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
