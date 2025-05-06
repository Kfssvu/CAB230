import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "./MovieDetails.css"
import NavBar from "./navbar";
import { APIcall } from "./Auth";

export default function MovieDetails() {
    const [ SearchParams ] = useSearchParams(); 
    const navigate = useNavigate();
    const imdbID = SearchParams.get("imdbID")
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        APIcall(`http://4.237.58.241:3000/movies/data/${imdbID}`)
            .then((data) => {
                setMovie(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
                alert("Error: Failed to fetch movie details");
            });
    }, [imdbID]);

    if (loading) return <p>Loading movie details...</p>;
    if (error) return (
    <>
    <NavBar/>
    <div style={{border:"5px solid red", fontSize:"40px", fontWeight:"10%"}}>
    <p>Error: Failed to fetch movie details</p>
    </div>
    </>)

    // Define column definitions for the AG Grid
    const columnDefs = [
        { field: "category", headerName: "Category", flex:1,valueFormatter: (params) => {
            return params.value
                .replace(/_/g, " ") 
                .replace(/\b\w/g, (char) => char.toUpperCase()); 
        } },
        { field: "name", headerName: "Name", flex:1},
        { field: "characters", headerName: "Characters", flex:1, valueFormatter: (params) => params.value.join(", ") },
    ];




    return (
        <>
        <NavBar/>
        <div className="details">
            <div id="overview">
                <h1>{movie.title}</h1>
                <img src={movie.poster} alt={`${movie.title} Poster`} />
                <p><strong>Year:</strong> {movie.year}</p>
                <p><strong>Runtime:</strong> {movie.runtime} minutes</p>
                <p><strong>Genres:</strong> {movie.genres.join(", ")}</p>
                <p><strong>Country:</strong> {movie.country}</p>
                <p><strong>Box Office:</strong> {movie.boxoffice==null ? "-": "$"+movie.boxoffice.toLocaleString()} </p>
                <p><strong>Plot:</strong> {movie.plot}</p>
            </div>
            <div id="ratings">
                <h2>Ratings</h2>
                <ul>
                    {movie.ratings.map((rating, index) => (
                        <li key={index}><strong>{rating.source}:</strong> {rating.value ?? "-"}</li>
                    ))}
                </ul>
            </div>
            <h2 style={{color:"black"}}>Principals</h2>
                <div
                className="ag-theme-quartz"
                id="principals"
            >
                <AgGridReact
                    rowData={movie.principals}
                    columnDefs={columnDefs}
                    pagination={false}
                    paginationPageSizeSelector={false}
                    onRowClicked={(row) => navigate(`/people?id=${row.data.id}`)}
                    rowStyle={{ cursor: "pointer" }}
                />
            </div>
        </div>
        <button style={{backgroundColor:"blue", position:"relative",left:"0%", borderRadius:"15px", marginBottom:"5px"}} onClick={() => navigate(-1)}>Back</button>
        </>
    );
}