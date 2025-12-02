import { useEffect, useState } from 'react'
import ShowCard from "../ui/ShowCard.jsx";

function Home({ searchTerm }) {

    // State to hold shows
    const [photos, setShows] = useState([]);

    // API URL
    const apiUrl = import.meta.env.VITE_SHOWS_API_URL;

    // Fetch data on mount
    useEffect(() => {
        const getShows = async () => {
            const response = await fetch(apiUrl);
            const result = await response.json();

            if (response.ok) {
                setShows(result);
            } else {
                console.error("API Error:", response.status, response.statusText);
            }
        };

        getShows();
    }, []);

    // Search and filter show and category
    const filteredShows = photos.filter(show => {
        const title = show.ShowTitle?.toLowerCase() || "";
        const category = show.CategoryName?.toLowerCase() || "";
        const search = searchTerm.toLowerCase();

        return (
            title.includes(search) ||
            category.includes(search)
        );
    });

   //group the filtered shows by category 
    const groupedShows = filteredShows.reduce((groups, show) => {
        const category = show.CategoryName || "Uncategorized";

        if (!groups[category]) {
            groups[category] = [];
        }

        groups[category].push(show);
        return groups;
    }, {});

    // Pluralize category titles
    const pluralizeCategory = (category) => {
        const pluralRules = {
            'Concert': 'Concerts',
            'Dance Party': 'Dance Parties',
            'Expo': 'Expos',
        };
        return pluralRules[category] || category + "s";
    };

    return (
        <div className="home-container">
            {filteredShows.length === 0 ? (
                <div className="loading-message">No matching events found...</div>
            ) : (
                Object.entries(groupedShows).map(([category, shows]) => (
                    <div key={category} className="category-section">
                        <h2 className="category-title">{pluralizeCategory(category)}</h2>

                        <div className="photo-grid">
                            {shows.map(show => (
                                <ShowCard
                                    key={show.ShowID}
                                    Showid={show.ShowID}
                                    Filename={show.FileName}
                                    ShowTitle={show.ShowTitle}
                                />
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default Home;
