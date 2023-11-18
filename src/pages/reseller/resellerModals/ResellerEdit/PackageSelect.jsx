const PackageSelect = ({
  id,
  onChangeHandler,
  isDisabled,
  isChecked,
  packageInfo,
}) => {
  return (
    <div>
      <input
        id={id}
        type="checkbox"
        value={packageInfo.id}
        onChange={onChangeHandler}
        disabled={isDisabled}
        checked={isChecked}
        className="form-check-input me-2"
      />
      <label className="form-check-label" htmlFor={id}>
        {packageInfo.name}
      </label>

      <span className="text-secondary">&#2547;{packageInfo.rate}</span>
    </div>
  );
};

export default PackageSelect;
