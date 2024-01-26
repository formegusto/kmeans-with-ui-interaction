import {
  GenMouseListener,
  RunToolbar,
  ScatterArea,
  SetKModal,
  SetLengthModal,
  UtilsArea,
} from "@components";
import { AppContext } from "@context";

function App() {
  return (
    <AppContext>
      <ScatterArea />
      <UtilsArea />
      <GenMouseListener />
      <SetKModal />
      <SetLengthModal />
      <RunToolbar />
    </AppContext>
  );
}

export default App;
