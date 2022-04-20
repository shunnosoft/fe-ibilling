import NumberFormat from "react-number-format";

const FormatNumber = (number) => {
  return (
    <NumberFormat
      value={number}
      displayType={"text"}
      thousandSeparator={true}
      thousandsGroupStyle="lakh"
      // prefix={"৳ "}
    />
  );
};

export default FormatNumber;
