import {
  GenMouseListener,
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
    </KMeansProvider>
  );
}

export default App;
