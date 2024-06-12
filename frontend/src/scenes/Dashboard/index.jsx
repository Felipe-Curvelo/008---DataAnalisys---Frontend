import React from 'react';
import {
  Container,
  Grid,
 } from '@mui/material';
import HeaderC from "../../components/HeaderC";
import SelectC from "../../components/SelectC";



const Dashboard = () => {

    return (
      <div className="App">
      <HeaderC />
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <SelectC />
        </Grid>
      </Container>
    </div>
      );
    }
    

export default Dashboard