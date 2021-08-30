import { Container, CssBaseline } from "@material-ui/core";
import MultiStepForm from "./components/MultiStepForm/MultiStepForm";

function App() {
  return (
    <div className="App">
      <Container>
        {/* <AppBar position="fixed">
          <Toolbar variant="dense">
            <Typography variant="h6">Multi-Step Form</Typography>
          </Toolbar>
        </AppBar> */}

        <CssBaseline />
        <MultiStepForm />
      </Container>
    </div>
  );
}

export default App;
