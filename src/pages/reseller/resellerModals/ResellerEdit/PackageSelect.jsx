const PackageSelect = ({
  id,
  onChangeHandler,
  isDisabled,
  isChecked,
  packageInfo,
}) => {
  return (
    <div className="form-check">
      <input
        id={id}
        type="checkbox"
        value={packageInfo.id}
        onChange={onChangeHandler}
        disabled={isDisabled}
        checked={isChecked}
        className="form-check-input"
      />
      <label className="form-check-label" htmlFor={id}>
        {packageInfo.name}
      </label>
    </div>
  );
};

export default PackageSelect;
