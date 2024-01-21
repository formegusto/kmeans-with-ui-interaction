import {
  GenMouseListener,
  RunToolbar,
  ScatterArea,
  SetModal,
  UtilsArea,
} from "@components";
import { KMeansProvider } from "@context";

function App() {
  return (
    <KMeansProvider>
      <ScatterArea />
      <UtilsArea />
      <GenMouseListener />
      <SetModal />
      <RunToolbar />
    </KMeansProvider>
  );
}

export default App;
