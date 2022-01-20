import "./common.css";

export default function TdLoader({ colspan }) {
  return (
    <td colSpan={colspan} className="LoaderTD">
      <div className="spinner-border text-success" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </td>
  );
}
