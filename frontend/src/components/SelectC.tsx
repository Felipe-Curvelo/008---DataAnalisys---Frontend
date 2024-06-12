import React, { useEffect, useState } from "react";
import axios from "axios";
import { Grid, FormControl,
    InputLabel,
    Select,
    MenuItem,
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody } from "@mui/material";
    import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';


const SelectC = () => {
  const [data, setData] = useState([]);
  const [seriesData, setSeriesData] = useState({});
  const [selectedSeries, setSelectedSeries] = useState(''); // Selected series name
  const [filteredSeries, setFilteredSeries] = useState([]); // Filtered series for search
  const [datasetId, setSeriesId] = useState('');
  const [countryData, setCountryData] = useState({});
  const [selectedCountry, setSelectedCountry] = useState(''); // Selected series name
  const [filteredCountries, setFilteredCountries] = useState([]); // Filtered series for search
  const [countryId, setCountryId] = useState('');
  const [years, setYears] = useState([]);
  const [selectedTimeBegin, setSelectedTimeBegin] = useState(1900);
  const [selectedTimeEnd, setSelectedTimeEnd] = useState(2024);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const yearOptions = [];
    for (let year = 1900; year <= currentYear; year++) {
      yearOptions.push(year);
    }
    setYears(yearOptions);
  }, []);

  const handleChangeTimeBegin = (event) => {
    setSelectedTimeBegin(event.target.value);
  };

  const handleChangeTimeEnd = (event) => {
    setSelectedTimeEnd(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/wbseries'); // Replace with your API URL
        setSeriesData(response.data); 
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchDataCountry = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/wbcountry'); // Replace with your API URL
        setCountryData(response.data); 
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDataCountry();
  }, []);

  const handleSearchChangeCountry = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = Object.keys(countryData)
      .filter((seriesName) => seriesName.toLowerCase().includes(searchTerm))
      .map((seriesName) => countryData[seriesName].name);
      setFilteredCountries(filtered);
  };

  const handleChangeCountry = (event) => {
    const selectedCountryName = event.target.value;
    setSelectedCountry(selectedCountryName);
    
    // Access dataset ID directly from seriesData
    const selectedCountryInfo = countryData[selectedCountryName];
    if (selectedCountryInfo) { // Check for existence before accessing dataset
      const countryId = selectedCountryInfo.dataset;
      setCountryId(countryId);
      console.log(`Selected country ID: ${countryId}`); // Log the dataset ID
    } else {
      console.warn(`Series "${selectedCountryName}" not found in seriesData.`);
    }
  };

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = Object.keys(seriesData)
      .filter((seriesName) => seriesName.toLowerCase().includes(searchTerm))
      .map((seriesName) => seriesData[seriesName].name);
    setFilteredSeries(filtered);
  };

  const handleChange = (event) => {
    const selectedSeriesName = event.target.value;
    setSelectedSeries(selectedSeriesName);
    
    // Access dataset ID directly from seriesData
    const selectedSeriesInfo = seriesData[selectedSeriesName];
    if (selectedSeriesInfo) { // Check for existence before accessing dataset
      const datasetId = selectedSeriesInfo.dataset;
      setSeriesId(datasetId);
      console.log(`Selected dataset ID: ${datasetId}`); // Log the dataset ID
    } else {
      console.warn(`Series "${selectedSeriesName}" not found in seriesData.`);
    }
  };

  // Update useEffect to use datasetId for the request
  useEffect(() => {
    const fetchData = async () => {
      if (datasetId, countryId, selectedTimeBegin, selectedTimeEnd) { // Only fetch data if datasetId is available
        try {
          const response = await axios.post("http://127.0.0.1:5000/wb", {
            "dataset": datasetId, // Use the selected dataset ID
            "country": countryId,
            "time_begin": selectedTimeBegin,
            "time_end": selectedTimeEnd
          });
          const transformedData = response.data.map((item) => ({
            year: item.year,
            value: item.value
          }));
          setData(transformedData);
        } catch (err) {
          console.log(err);
        }
      }
    };

    fetchData();
  }, [datasetId, countryId, selectedTimeBegin, selectedTimeEnd]); // Re-run useEffect only when datasetId changes

  return (
    <>
        <Grid item xs={12} margin="10px">
            <Grid container spacing={2}>
              {/* Container for select boxes */}
              <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="time-begin-label">Begin Date:</InputLabel>
                <Select
                  labelId="time-begin-label"
                  id="time-begin"
                  value={selectedTimeBegin}
                  label="Time Begin"
                  onChange={handleChangeTimeBegin}
                >
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              </Grid>
              <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="time-end-label">End Date:</InputLabel>
                <Select
                  labelId="time-end-label"
                  id="time-end"
                  value={selectedTimeEnd}
                  label="Time End"
                  onChange={handleChangeTimeEnd}
                >
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              </Grid>
              <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="series-select-label">Select Series</InputLabel>
                <Select
                  labelId="series-select-label"
                  id="series-select"
                  value={selectedSeries}
                  onChange={handleChange}
                >
                  {filteredSeries.length > 0 ? (
                    filteredSeries.map((seriesName) => (
                      <MenuItem key={seriesName} value={seriesName}>
                        {seriesName}
                      </MenuItem>
                    ))
                  ) : (
                    Object.keys(seriesData).map((seriesName) => (
                      <MenuItem key={seriesName} value={seriesName}>
                        {seriesData[seriesName].name}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
              </Grid>
              <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="country-select-label">Select Country</InputLabel>
                <Select
                  labelId="country-select-label"
                  id="country-select"
                  value={selectedCountry}
                  onChange={handleChangeCountry}
                >
                  {filteredCountries.length > 0 ? (
                    filteredCountries.map((seriesName) => (
                      <MenuItem key={seriesName} value={seriesName}>
                        {seriesName}
                      </MenuItem>
                    ))
                  ) : (
                    Object.keys(countryData).map((seriesName) => (
                      <MenuItem key={seriesName} value={seriesName}>
                        {countryData[seriesName].name}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
              </Grid>
              
              {/* Add more select boxes if needed */}
            </Grid>
        </Grid>
          <Grid item xs={12} container justifyContent="center" >
          <Paper elevation={10}>
          <LineChart width={800} height={500} data={data} >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />

            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
          </Paper>
        </Grid>
        <Grid item xs={12}>
            <Paper elevation={3}>
              <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Year</TableCell>
                      <TableCell>Value</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {data.map((row) => (
                    <TableRow key={row.year}>
                      <TableCell component="th" scope="row">
                        {row.year}
                      </TableCell>
                      <TableCell align="right">{row.value}</TableCell>
                    </TableRow>
                  ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
        </Grid>

    </>
  )
}

export default SelectC