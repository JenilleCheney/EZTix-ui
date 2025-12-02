import { Container } from 'react-bootstrap'
import NavMenu from './NavMenu'

const Header = ({ searchTerm, onSearchChange }) => {
  return (
    <>
      <Container className="header">
        <NavMenu 
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
        />
      </Container>
    </>
  )
}

export default Header
