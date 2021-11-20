import React, { useState } from 'react'
import './inputs.css'

export default function FormInput(props) {
  const [focused, setFocused] = useState(false)
  const inputsData = props
  const { label, errorMessage, onChange, id, ...inputProps } = inputsData

  const handleFocus = (e) => {
    setFocused(true)
  }

  return (
    <div className="company inputClass">
      <label>{label}</label>
      {inputsData.name === 'pack' ? (
        <div className="company inputClass">
          <label htmlFor="company">আপনার পছন্দের প্যাকেজ সিলেক্ট করুন</label>
          <select required className="form-select" name="pack" {...inputProps} onChange={onChange}>
            <option defaultValue>Select a Packege</option>
            <option value="Basic">Basic</option>
            <option value="Bronze">Bronze</option>
            <option value="Silver">Silver</option>
            <option value="Gold">Gold</option>
            <option value="Platinum">Platinum</option>
            <option value="Diamond">Diamond</option>
            <option value="Old">Old</option>
            <option value="P1">P1</option>
            <option value="P2">P2</option>
            <option value="P3">P3</option>
            <option value="P4">P4</option>
          </select>
        </div>
      ) : (
        <input
          type="text"
          {...inputProps}
          onChange={onChange}
          onBlur={handleFocus}
          focused={focused.toString()}
        />
      )}

      <span>{errorMessage}</span>
    </div>
  )
}
