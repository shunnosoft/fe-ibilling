import { forwardRef, useEffect, useRef } from "react";

const IndeterminateCheckbox = forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = useRef();
  const resolvedRef = ref || defaultRef;

  useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  return (
    <>
      <input
        class="form-check-input"
        type="checkbox"
        id="selectRows"
        ref={resolvedRef}
        {...rest}
      />
    </>
  );
});

export default IndeterminateCheckbox;
