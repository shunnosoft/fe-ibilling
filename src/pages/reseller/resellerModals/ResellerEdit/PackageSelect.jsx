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
        className="me-2"
      />
      <label className="form-check-label" htmlFor={id}>
        {packageInfo.name}
      </label>
    </div>
  );
};

export default PackageSelect;
