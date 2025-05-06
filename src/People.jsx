import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import NavBar from "./navbar";
import { AgGridReact } from "ag-grid-react";
import { Bar } from "react-chartjs-2";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import "./People.css"
import { APIcall } from "./Auth";


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function People() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const id = searchParams.get("id"); 
    const [person, setPerson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("Btoken")
        APIcall(`http://4.237.58.241:3000/people/${id}`,undefined,undefined, {"Authorization": `Bearer ${token}`})
            .then((data) => {
                setPerson(data);
                setLoading(false);
                console.log(data)
            })
            .catch((err) => {
                if (err.message.includes("JWT token has expired")) {
                    navigate("/")
                }
                else{
                setError(err.message);
                setLoading(false);
                alert("Error: Failed to fetch person details");
                }
            });
    }, [id]);

    if (loading) return <p>Loading person details...</p>;
    if (error) return (
        <>
        <NavBar />
        <div style={{border:"10px solid red", backgroundColor:"black",color:"red",fontSize:"40px", fontWeight:"10%"}}>
          <p>Error: Failed to fetch person details</p>
        </div>
        </>
      )

    // Define column definitions for the AG Grid
    const columnDefs = [
        { field: "movieName", headerName: "Movie Name", flex:1},
        { field: "category", headerName: "Category", valueFormatter: (params) => params.value.charAt(0).toUpperCase() + params.value.slice(1), flex:1 },
        { field: "characters", headerName: "Characters", valueFormatter: (params) => params.value.length === 0 ? "-": params.value.join(", "), flex:1 },
        { field: "imdbRating", headerName: "IMDb Rating", flex:1 },
    ];

    // Prepare data for the bar chart
    const imdbRatings = person.roles.map((role) => role.imdbRating);
    const ratingBuckets = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; 
    imdbRatings.forEach((rating) => {
        const bucketIndex = Math.floor(rating);
        ratingBuckets[bucketIndex]++;
    });

    const chartData = {
        labels: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", "9-10"],
        datasets: [
            {
                label: "Number of Movies",
                data: ratingBuckets,
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 2,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
        },
        scales: {
            y: {
                grid: {
                    lineWidth: 2,
                },
                ticks: { color: 'rgba(0, 0, 0, 0.6)', beginAtZero: true, font:{weight:'bold'} }
            },
            x: {
                grid: {
                    lineWidth: 2,
                },
                ticks: { color: 'rgba(0, 0, 0, 0.6)', beginAtZero: true, font:{weight:'bold'}  }
            }
          }
    };

    return (
        <div>
            <NavBar />
            <div className="person-details">
                <h1 style={{fontFamily:"Impact, fantasy", fontSize:"75px"}}><strong>{person.name}</strong></h1>
                <p><strong>Birth Year:</strong> {person.birthYear ?? "-"}</p>
                {person.deathYear && <p><strong>Death Year:</strong> {person.deathYear}</p>}
                <h2>Roles</h2>
                <div
                    className="ag-theme-quartz"
                    id= "person-roles"
                >
                    <AgGridReact
                        rowData={person.roles}
                        columnDefs={columnDefs}
                        pagination={false}
                        paginationPageSizeSelector={false}
                        onRowClicked={(row) => navigate(`/movies/data?imdbID=${row.data.movieId}`)} 
                        rowStyle={{ cursor: "pointer" }}
                    />
                </div>
                <div id="ratingchart" >
                <h2>IMDB Ratings at a Glance</h2>
                    <Bar data={chartData} options={chartOptions} />
                </div>
            </div>
            <button
                    style={{backgroundColor:"blue", position:"relative",left:"0", marginBottom:"3%"}}
                    onClick={() => navigate(-1)} 
                >
                    Back
            </button>
        </div>
    );
}