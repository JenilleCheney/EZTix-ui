import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'

function Details() {
    const { id } = useParams() 

    // Define a state variable to hold photo by id
    const [show, setShow] = useState(null)

    // Get API Url from environment variables
    const apiUrl = import.meta.env.VITE_PHOTOS_API_URL

    // Fetch photo by id from API when component mounts
    useEffect(() => { 
        const getShowById = async () => { 
            const response = await fetch(`${apiUrl}/${id}`) 
            const result = await response.json()
            
            if(response.ok) { 
                setShow(result)
            }
        } 

        getShowById()
    }, [])


    return (
        <>
            <p><Link to="/">← Back to Home</Link></p>

            <div>
                { show && (
                    <>
                        <h2>{show.ShowTitle}</h2>
                        <img src={show.Filename} alt={show.ShowTitle} width="600" />
                    </>
                )}
            </div>

            <h3>Tickets</h3>

            <p>Comming soon...</p>

            <p><Link to={`/ticket/${id}`}>Buy Tickets Now</Link></p>
        </>
    )
}

export default Details