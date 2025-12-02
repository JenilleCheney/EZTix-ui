import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'

function Ticket() {
    const { id } = useParams()

    return (
        <>
            <p><Link to={`/details/${id}`}>← Back to Show</Link></p>

            <div>Ticket Page for ID:{id}</div>
        </>
    )
}

export default Ticket