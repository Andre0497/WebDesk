import DesktopCanvas from './components/desktop/DesktopCanvas'
import { useTheme } from './hooks/useTheme'

function App() {
  // Wird in Task 6.1 durch den desktopStore ersetzt
  const { theme, toggleTheme } = useTheme('dark')

  return <DesktopCanvas theme={theme} onToggleTheme={toggleTheme} />
}

export default App
