import { createRoot } from 'react-dom/client'
import './index.css'
import { Home } from './pages/home.page.tsx'

createRoot(document.getElementById('root')!).render(
  <Home />
)
