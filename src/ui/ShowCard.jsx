import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card'

function ShowCard(props) {
    // Construct the full image URL
    const imageUrl = `https://localhost:7145/images/${props.Filename}`
    
    return (
        <Card className="show-card h-100">
            <Link to={`/details/${props.Showid}`} className="text-decoration-none">
                <div className="show-card-img-wrapper">
                    <Card.Img variant="top" src={imageUrl} alt={props.ShowTitle} />
                </div>
                <Card.Body>
                    <Card.Title className="text-dark">{props.ShowTitle}</Card.Title>
                </Card.Body>
            </Link>
        </Card>
    )
}

export default ShowCard