import VirtualInfiniteScroll from "./components/VirtualInfiniteScroll";
import Item from "./components/Item";

function App() {
  return (
    <div className="App">
      <VirtualInfiniteScroll
        RenderItem={Item}
        itemHeight={50}
        containerHeight={500}
        buffer={5}
        fetchDataURL="http://openlibrary.org/search.json?q=kaka"
      />
    </div>
  );
}

export default App;
