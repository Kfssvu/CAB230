import { AgGridReact } from "ag-grid-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from 'react'
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-quartz.css"
import "./movies.css"
import NavBar from "./navbar";
import { APIcall } from "./Auth";


export default function Movies() {
    const [rowData, setRowData] = useState([]);
    const [totalResults, setTotalResults] = useState(0);
    const [rowModelType, setRowModelType] = useState("infinite");
    const [title, setTitle] = useState("");
    const [year, setYear] = useState(""); 
    const [searchParams, setSearchParams] = useState({ title: "", year: "" });
    const navigate = useNavigate();
    const columnDefs = [
        { field: "title", headerName: "Title", flex:1},
        { field: "year", headerName: "Year", flex:1 },
        { field: "imdb", headerName: "IMDB Rating", flex:1 ,valueFormatter: (params) => params.value??"-"},
        { field: "rottenTomatoes", headerName: "Rotten Tomatoes Rating", flex:1,valueFormatter: (params) => params.value??"-"},
        { field: "metacritic", headerName: "Metacritic Rating", flex:1,valueFormatter: (params) => params.value??"-"},
        { field: "Rated", headerName: "Rated", flex:1}
    ];


    const dataSource = useMemo(() => ({
        getRows: (params) => {
            const {  endRow } = params;
            const page = endRow/100;

            // Fetch data from the server
            APIcall(`http://4.237.58.241:3000/movies/search?title=${searchParams.title}&year=${searchParams.year}&page=${page}`)
                .then((json) => {
                    const data = json.data;
                    const totalCount = json.pagination.total;

                    // Update total results
                    setTotalResults(totalCount);
                    const rowData = data.map((movie) => ({
                        title: movie.title,
                        year: movie.year,
                        imdb: movie.imdbRating,
                        rottenTomatoes: movie.rottenTomatoesRating,
                        metacritic: movie.metacriticRating,
                        Rated: movie.classification,
                        imdbID: movie.imdbID
                    }));

                    // Check if total results are below the threshold
                    if (totalCount <= 50) {
                        // Switch to client-side row model
                        setRowModelType("clientSide");
                         // Load all data into the grid
                        setRowData(rowData)
                    } else {
                        // Pass the data back to the grid
                        params.successCallback(rowData, totalCount);
                    }
                })
                .catch((error) => {
                    alert("Error: Failed to fetch data");
                    console.error("Error fetching data:", error);
                    params.failCallback();
                });
        },
    }), [searchParams]);

    const handleSearch = () => {
        setSearchParams({ title, year });
        setRowModelType("infinite");
        setRowData([]);
        setTotalResults(0);
    };
    return (
        <>
        <div><NavBar/></div>
        <div id="filterbar" >
                <label>
                    Title:
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter movie title"
                    />
                </label>
                <label style={{marginLeft:"20px"}}>
                    Year:
                    <input
                        type="text"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        placeholder="Enter release year"
                    />
                </label>
                <button id="searchbutton" onClick={handleSearch}>Search</button>
            </div>
        <div className="ag-theme-quartz"
        style={{
        height: "70vh",
        width: "70vw",
        }}
        id="moviestable">
            <AgGridReact 
            key={rowModelType}
            columnDefs={columnDefs} 
            rowData={rowModelType === "clientSide" ? rowData : null} 
            pageSize={100}
            rowModelType={rowModelType}
            cacheBlockSize={100}
            maxBlocksInCache={5}
            datasource={rowModelType === "infinite" ? dataSource : null}
            onRowClicked={(row) => navigate(`/movies/data?imdbID=${row.data.imdbID}`)}
            rowStyle={{ cursor: "pointer" }}
            />
        </div>
        </>
    )
}


    // useEffect(() => {
    //     fetch("http://4.237.58.241:3000/movies/search")
    //         .then((response) => response.json())
    //         .then(json => json.data)
    //         .then(res => res.map(movie => {
    //             return {
    //                 title: movie.title,
    //                 year: movie.year,
    //                 imdb: movie.imdbRating,
    //                 rottenTomatoes: movie.rottenTomatoesRating,
    //                 metacritic: movie.metacriticRating,
    //                 Rated: movie.classification
    //             }
    //         }))
    //         .then(data => setRowData(data))
    //         .catch((error) => console.error("Error fetching data:", error));
    // }
    // , []);

    // const dataSource = useMemo(() => ({
    //     getRows: (params) => {
    //         console.log("Requesting rows", params);
    //         const { startRow, endRow } = params;
    //         const page = endRow/100;
    //         const title = "Kate"
    //         const year =""

    //         fetch(`http://4.237.58.241:3000/movies/search?title=${title}&year=${year}&page=${page}`)
    //             .then((response) => response.json())
    //             .then((json) => json.data)
    //             .then((data) => {
    //                 const rowData = data.map((movie) => ({
    //                     title: movie.title,
    //                     year: movie.year,
    //                     imdb: movie.imdbRating,
    //                     rottenTomatoes: movie.rottenTomatoesRating,
    //                     metacritic: movie.metacriticRating,
    //                     Rated: movie.classification,
    //                 }));
    //                 params.successCallback(rowData, data.totalCount); 
    //             })
    //             .catch((error) => {
    //                 console.error("Error fetching data:", error);
    //                 params.failCallback();
    //             });
    //     },
    // }), []);
