import { ScatterArea, UtilsArea, UtilsButton } from "@components";
import { KMeansProvider } from "@context";

function App() {
  return (
    <KMeansProvider>
      <ScatterArea />
      <UtilsArea />
    </KMeansProvider>
  );
}

export default App;
