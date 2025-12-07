import { Navbar, Container } from 'react-bootstrap'
import NavMenu from './NavMenu'

const Header = ({ searchTerm, onSearchChange }) => {
  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        <NavMenu searchTerm={searchTerm} onSearchChange={onSearchChange} />
      </Container>
    </Navbar>
  )
}

export default Header
