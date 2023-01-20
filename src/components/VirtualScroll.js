import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const VirtualScroll = ({
  fetchDataURL,
  containerHeight,
  itemHeight,
  RenderItem,
  buffer,
}) => {
  const [loading, setLoading] = useState(false);
  const [itemList, setItemList] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [scrollTop, setScrollTop] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const containerRef = useRef();

  const fetchApiData = async (pageNo) => {
    setLoading(true);
    const res = await fetch(`${fetchDataURL}&page=${pageNo}`);
    const data = await res.json();
    setHasMore(!!data.docs.length);
    setItemList([...itemList, ...data.docs]);
    setLoading(false);
  };

  const lastItemRef = useCallback(
    (lastItemElement) => {
      if (lastItemElement && loading === false && hasMore) {
        setPageNo((pageNo) => pageNo + 1);
      }
    },
    [loading, hasMore]
  );

  useEffect(() => {
    fetchApiData(pageNo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNo]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.onscroll = function () {
        requestAnimationFrame(function () {
          setScrollTop(containerRef.current.scrollTop);
        });
      };
    }
  }, []);

  useEffect(() => {
    setStartIndex(Math.max(Math.round(scrollTop / itemHeight) - buffer, 0));
  }, [scrollTop, itemHeight, buffer]);

  const getRowData = useMemo(() => {
    const endIndex = Math.min(
      startIndex + Math.round(containerHeight / itemHeight) + 2 * buffer,
      itemList.length
    );
    let visibleListItems = itemList.slice(startIndex, endIndex);
    visibleListItems = visibleListItems.map((item, index) => {
      if (
        endIndex === itemList.length &&
        index === visibleListItems.length - 1
      ) {
        return <RenderItem ref={lastItemRef} key={item.key} item={item} />;
      } else {
        return <RenderItem key={item.key} item={item} />;
      }
    });
    if (loading && endIndex === itemList.length) {
      visibleListItems.push(
        <div key="loading">
          <center>
            <h3>Loading...</h3>
          </center>
        </div>
      );
    }
    return visibleListItems;
  }, [
    startIndex,
    itemHeight,
    containerHeight,
    itemList,
    buffer,
    lastItemRef,
    loading,
  ]);

  return (
    <div
      ref={containerRef}
      className="container"
      style={{ height: `${containerHeight}px` }}
    >
      <div
        className="fake-height-container"
        style={{ height: `${itemHeight * itemList.length}px` }}
      >
        <div
          className="viewport"
          style={{
            transform: `translateY(${startIndex * itemHeight}px)`,
            willChange: "transform",
          }}
        >
          {getRowData}
        </div>
      </div>
    </div>
  );
};

export default VirtualScroll;
