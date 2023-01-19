import { forwardRef } from "react";

const Item = forwardRef(({ item }, ref) => {
  return (
    <div ref={ref} className="item">
      {item.title}
    </div>
  );
});
export default Item;
