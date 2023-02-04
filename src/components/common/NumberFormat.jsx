import NumberFormat from "react-number-format";

const FormatNumber = (number) => {
  return (
    <NumberFormat
      value={number}
      displayType={"text"}
      thousandSeparator={true}
      thousandsGroupStyle="lakh"
      decimalScale={2}
      // prefix={"৳ "}
    />
  );
};

export default FormatNumber;
