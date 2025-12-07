import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap'

function Details() {
    const { id } = useParams() 
    const [show, setShow] = useState(null)
    const [loading, setLoading] = useState(true)

    const apiUrl = import.meta.env.VITE_SHOWS_API_URL

    useEffect(() => { 
        const getShowById = async () => { 
            try {
                const response = await fetch(`${apiUrl}/${id}`) 
                const result = await response.json()
                
                if(response.ok) { 
                    setShow(result)
                }
            } catch (error) {
                console.error('Error fetching show:', error)
            } finally {
                setLoading(false)
            }
        } 

        getShowById()
    }, [id, apiUrl])

    const formatDate = (dateString) => {
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }
        return new Date(dateString).toLocaleDateString('en-US', options)
    }

    if (loading) {
        return (
            <Container className="details-container">
                <div className="loading-message">Loading event details...</div>
            </Container>
        )
    }

    if (!show) {
        return (
            <Container className="details-container">
                <div className="loading-message">Event not found</div>
                <Link to="/" className="btn btn-primary mt-3">← Back to Home</Link>
            </Container>
        )
    }

    return (
        <Container className="details-container">
            <Link to="/" className="back-link">← Back to Home</Link>

            <Row className="mt-4">
                <Col lg={6}>
                    <div className="details-image-wrapper">
                        <img 
                            src={`https://localhost:7145/images/${show.FileName}`} 
                            alt={show.Title} 
                            className="details-image"
                        />
                    </div>
                </Col>
                
                <Col lg={6}>
                    <Card className="details-card">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <h1 className="details-title">{show.Title}</h1>
                                <Badge bg="primary" className="category-badge">
                                    {show.CategoryName}
                                </Badge>
                            </div>

                            <div className="details-info">
                                <div className="info-item">
                                    <i className="bi bi-calendar-event"></i>
                                    <div>
                                        <strong>Date & Time</strong>
                                        <p>{formatDate(show.ShowTime)}</p>
                                    </div>
                                </div>

                                <div className="info-item">
                                    <i className="bi bi-geo-alt"></i>
                                    <div>
                                        <strong>Venue</strong>
                                        <p>{show.VenueName}</p>
                                    </div>
                                </div>

                                <div className="info-item">
                                    <i className="bi bi-person"></i>
                                    <div>
                                        <strong>Organizer</strong>
                                        <p>{show.Owner}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="details-description">
                                <h5>About This Event</h5>
                                <p>{show.Description}</p>
                            </div>

                            <Button 
                                as={Link} 
                                to={`/tickets/${id}`} 
                                variant="primary" 
                                size="lg" 
                                className="buy-tickets-btn w-100"
                            >
                                Buy Tickets Now
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default Details