import VirtualScroll from "./components/VirtualScroll";
import Item from "./components/Item";

function App() {
  return (
    <div className="App">
      <VirtualScroll
        RenderItem={Item}
        itemHeight={50}
        containerHeight={500}
        buffer={0}
        fetchDataURL="http://openlibrary.org/search.json?q=hello"
      />
    </div>
  );
}

export default App;
