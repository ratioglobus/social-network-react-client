import { Header } from '../header'
import { Container } from '../container'
import { NavBar } from '../nav-bar'
import { Outlet, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated, selectCurrent } from '../../features/userSlice'
import { useEffect } from 'react'
import { Profile } from '../profile'


export const Layout = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrent)
  const navigate = useNavigate();

  useEffect(() => {
    if(!isAuthenticated) {
      navigate('/auth')
    }
  }, [])

  return (
    <>
        <Header/>
        <Container>
          <div className="flex-2 p-4">
            <NavBar/>
          </div>
          <div className='flex-1 p-4'>
            <Outlet />
          </div>
          <div className='flex-2 p-4'>
            <div className='flex-col flex gap-5'>
              {user && <Profile user={user} />}
            </div>
          </div>
        </Container>
    </>
  )
}
