import { GenMouseListener, ScatterArea, UtilsArea } from "@components";
import { KMeansProvider } from "@context";

function App() {
  return (
    <KMeansProvider>
      <ScatterArea />
      <UtilsArea />
      <GenMouseListener />
    </KMeansProvider>
  );
}

export default App;
