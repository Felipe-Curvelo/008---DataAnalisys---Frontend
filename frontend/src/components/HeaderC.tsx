import { Typography, Toolbar, AppBar } from "@mui/material";


function HeaderC() {
  return (
    <>
        <AppBar position="static">
        <Toolbar variant="dense" style={{ justifyContent: 'space-between' }} >
          <Typography variant="h6" color="inherit">
            Macro Economic Indicators
          </Typography>
        </Toolbar>
      </AppBar>
    </>
  )
}

export default HeaderC