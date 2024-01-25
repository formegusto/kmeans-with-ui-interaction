import {
  GenMouseListener,
  RunToolbar,
  ScatterArea,
  SetModal,
  UtilsArea,
} from "@components";
import { AppContext } from "@context";

function App() {
  return (
    <AppContext>
      <ScatterArea />
      <UtilsArea />
      <GenMouseListener />
      <SetModal />
      <RunToolbar />
    </AppContext>
  );
}

export default App;
