import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'

function Ticket() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [show, setShow] = useState(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [errors, setErrors] = useState({})
    const [submitMessage, setSubmitMessage] = useState(null)
    
    const [formData, setFormData] = useState({
        ShowId: id,
        NumTicketsOrdered: '1',
        CustFirstName: '',
        CustLastName: '',
        CustEmail: '',
        PhoneNumber: '',
        Address: '',
        CreditCardType: 'Visa',
        CreditCardNumber: '',
        ExpirationDate: '',
        CVV: ''
    })

    const apiUrl = import.meta.env.VITE_SHOWS_API_URL

    useEffect(() => {
        const getShowById = async () => {
            try {
                const response = await fetch(`${apiUrl}/${id}`)
                const result = await response.json()
                if (response.ok) {
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

    const validateForm = () => {
        const newErrors = {}

        // Validate number of tickets
        if (!formData.NumTicketsOrdered || formData.NumTicketsOrdered < 1) {
            newErrors.NumTicketsOrdered = 'Please enter a valid number of tickets'
        }

        // Validate name fields
        if (!formData.CustFirstName.trim()) {
            newErrors.CustFirstName = 'First name is required'
        }
        if (!formData.CustLastName.trim()) {
            newErrors.CustLastName = 'Last name is required'
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!formData.CustEmail.trim()) {
            newErrors.CustEmail = 'Email is required'
        } else if (!emailRegex.test(formData.CustEmail)) {
            newErrors.CustEmail = 'Please enter a valid email address'
        }

        // Validate phone number
        const phoneRegex = /^\d{10}$/
        const cleanPhone = formData.PhoneNumber.replace(/\D/g, '')
        if (!cleanPhone) {
            newErrors.PhoneNumber = 'Phone number is required'
        } else if (!phoneRegex.test(cleanPhone)) {
            newErrors.PhoneNumber = 'Phone number must be 10 digits'
        }

        // Validate address
        if (!formData.Address.trim()) {
            newErrors.Address = 'Address is required'
        }

        // Validate credit card number (16 digits)
        const cleanCard = formData.CreditCardNumber.replace(/\s/g, '')
        if (!cleanCard) {
            newErrors.CreditCardNumber = 'Credit card number is required'
        } else if (!/^\d{16}$/.test(cleanCard)) {
            newErrors.CreditCardNumber = 'Credit card must be 16 digits'
        }

        // Validate expiration date (MM/YY format)
        if (!formData.ExpirationDate) {
            newErrors.ExpirationDate = 'Expiration date is required'
        } else if (!/^\d{2}\/\d{2}$/.test(formData.ExpirationDate)) {
            newErrors.ExpirationDate = 'Format must be MM/YY'
        } else {
            const [month, year] = formData.ExpirationDate.split('/')
            const expDate = new Date(`20${year}`, month - 1)
            if (expDate < new Date()) {
                newErrors.ExpirationDate = 'Card has expired'
            }
        }

        // Validate CVV (3-4 digits)
        if (!formData.CVV) {
            newErrors.CVV = 'CVV is required'
        } else if (!/^\d{3,4}$/.test(formData.CVV)) {
            newErrors.CVV = 'CVV must be 3 or 4 digits'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!validateForm()) {
            setSubmitMessage({
                type: 'danger',
                text: 'Please fix the errors in the form before submitting.'
            })
            return
        }

        setSubmitting(true)
        setSubmitMessage(null)

        try {
            const response = await fetch(`${apiUrl}/purchases`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })

            if (response.ok) {
                setSubmitMessage({
                    type: 'success',
                    text: `Success! Your ${formData.NumTicketsOrdered} ticket(s) for ${show?.Title} have been purchased. A confirmation email will be sent to ${formData.CustEmail}.`
                })
                // Reset form after successful submission
                setTimeout(() => {
                    navigate(`/details/${id}`)
                }, 3000)
            } else {
                const errorData = await response.json()
                setSubmitMessage({
                    type: 'danger',
                    text: errorData.error || 'There was an error processing your purchase. Please try again.'
                })
            }
        } catch (error) {
            setSubmitMessage({
                type: 'danger',
                text: 'Network error. Please check your connection and try again.'
            })
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <Container className="tickets-container">
                <div className="loading-message">Loading...</div>
            </Container>
        )
    }

    return (
        <Container className="tickets-container">
            <Link to={`/details/${id}`} className="back-link">← Back to Event Details</Link>

            <h1 className="tickets-page-title">Purchase Tickets</h1>
            
            {show && (
                <Card className="event-summary-card mb-4">
                    <Card.Body>
                        <Row>
                            <Col md={2}>
                                <img 
                                    src={`https://localhost:7145/images/${show.FileName}`}
                                    alt={show.Title}
                                    className="summary-image"
                                />
                            </Col>
                            <Col md={10}>
                                <h4>{show.Title}</h4>
                                <p className="mb-1"><strong>Venue:</strong> {show.VenueName}</p>
                                <p className="mb-1"><strong>Date:</strong> {new Date(show.ShowTime).toLocaleDateString()}</p>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            )}

            {submitMessage && (
                <Alert variant={submitMessage.type} className="mb-4">
                    {submitMessage.text}
                </Alert>
            )}

            <Card className="purchase-form-card">
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <h5 className="form-section-title">Ticket Quantity</h5>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Number of Tickets *</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="NumTicketsOrdered"
                                        min="1"
                                        value={formData.NumTicketsOrdered}
                                        onChange={handleChange}
                                        isInvalid={!!errors.NumTicketsOrdered}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.NumTicketsOrdered}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <h5 className="form-section-title mt-4">Contact Information</h5>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>First Name *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="CustFirstName"
                                        value={formData.CustFirstName}
                                        onChange={handleChange}
                                        isInvalid={!!errors.CustFirstName}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.CustFirstName}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Last Name *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="CustLastName"
                                        value={formData.CustLastName}
                                        onChange={handleChange}
                                        isInvalid={!!errors.CustLastName}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.CustLastName}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email Address *</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="CustEmail"
                                        value={formData.CustEmail}
                                        onChange={handleChange}
                                        isInvalid={!!errors.CustEmail}
                                        placeholder="example@email.com"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.CustEmail}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Phone Number *</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        name="PhoneNumber"
                                        value={formData.PhoneNumber}
                                        onChange={handleChange}
                                        isInvalid={!!errors.PhoneNumber}
                                        placeholder="1234567890"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.PhoneNumber}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Address *</Form.Label>
                            <Form.Control
                                type="text"
                                name="Address"
                                value={formData.Address}
                                onChange={handleChange}
                                isInvalid={!!errors.Address}
                                placeholder="123 Main St, City, State, ZIP"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.Address}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <h5 className="form-section-title mt-4">Payment Information</h5>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Card Type *</Form.Label>
                                    <Form.Select
                                        name="CreditCardType"
                                        value={formData.CreditCardType}
                                        onChange={handleChange}
                                    >
                                        <option value="Visa">Visa</option>
                                        <option value="Mastercard">Mastercard</option>
                                        <option value="American Express">American Express</option>
                                        <option value="Discover">Discover</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Card Number *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="CreditCardNumber"
                                        value={formData.CreditCardNumber}
                                        onChange={handleChange}
                                        isInvalid={!!errors.CreditCardNumber}
                                        placeholder="1234 5678 9012 3456"
                                        maxLength="19"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.CreditCardNumber}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Expiration Date (MM/YY) *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="ExpirationDate"
                                        value={formData.ExpirationDate}
                                        onChange={handleChange}
                                        isInvalid={!!errors.ExpirationDate}
                                        placeholder="MM/YY"
                                        maxLength="5"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.ExpirationDate}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>CVV *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="CVV"
                                        value={formData.CVV}
                                        onChange={handleChange}
                                        isInvalid={!!errors.CVV}
                                        placeholder="123"
                                        maxLength="4"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.CVV}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="d-grid gap-2 mt-4">
                            <Button 
                                variant="primary" 
                                size="lg" 
                                type="submit"
                                disabled={submitting}
                            >
                                {submitting ? 'Processing...' : 'Complete Purchase'}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    )
}

export default Ticket