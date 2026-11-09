import React from "react";

const minimumFields = [
  { name: "min_tenth", label: "Minimum 10th (%)", max: 100 },
  { name: "min_twelfth", label: "Minimum 12th (%)", max: 100 },
  { name: "min_degree", label: "Minimum Degree (%)", max: 100 },
  { name: "min_cmce", label: "Minimum CMCE Marks", max: 9999.99 },
  { name: "min_ccee", label: "Minimum CCEE Marks", max: 9999.99 }
];

export default function DriveForm({
  driveForm,
  setDriveForm,
  onSubmit,
  onCancel,
  saving = false
}) {
  function updateField(event) {
    const { name, value } = event.target;

    setDriveForm((previous) => ({
      ...previous,
      [name]: value
    }));
  }

  const anyYear =
    driveForm.passout_year === "" ||
    driveForm.passout_year === null ||
    driveForm.passout_year === undefined;

  return (
    <form onSubmit={onSubmit} className="drive-form">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="drive-company">Company Name</label>
          <input
            id="drive-company"
            name="company"
            required
            value={driveForm.company}
            onChange={updateField}
            placeholder="e.g. TCS"
          />
        </div>

        <div className="form-group">
          <label htmlFor="drive-role">Job Role</label>
          <input
            id="drive-role"
            name="role"
            required
            value={driveForm.role}
            onChange={updateField}
            placeholder="e.g. Java Developer"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="drive-package">Package (CTC)</label>
          <input
            id="drive-package"
            name="package"
            required
            value={driveForm.package}
            onChange={updateField}
            placeholder="e.g. 6 LPA"
          />
        </div>

        <div className="form-group">
          <label htmlFor="drive-location">Location</label>
          <input
            id="drive-location"
            name="location"
            required
            value={driveForm.location}
            onChange={updateField}
            placeholder="e.g. Pune"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="drive-date">Drive Date</label>
          <input
            id="drive-date"
            type="date"
            name="drive_date"
            required
            value={driveForm.drive_date}
            onChange={updateField}
          />
        </div>

        <div className="form-group">
          <label htmlFor="drive-year">Passout Year</label>
          <input
            id="drive-year"
            type="number"
            name="passout_year"
            min="1900"
            max="9999"
            step="1"
            required={!anyYear}
            disabled={anyYear}
            value={driveForm.passout_year ?? ""}
            onChange={updateField}
            placeholder="Any year"
          />

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <input
              type="checkbox"
              checked={anyYear}
              style={{ width: "auto" }}
              onChange={(event) =>
                setDriveForm((previous) => ({
                  ...previous,
                  passout_year: event.target.checked
                    ? ""
                    : String(new Date().getFullYear())
                }))
              }
            />
            Any year
          </label>
        </div>
      </div>

      <h4>Academic Eligibility</h4>
      <p>
        Leave a minimum blank if it is not required. Enter CMCE
        and CCEE minimums on the same scale as student marks.
      </p>

      {minimumFields.map((field) => (
        <div className="form-group" key={field.name}>
          <label htmlFor={field.name}>{field.label}</label>
          <input
            id={field.name}
            type="number"
            name={field.name}
            min="0"
            max={field.max}
            step="0.01"
            value={driveForm[field.name] ?? ""}
            onChange={updateField}
            placeholder="Not required"
          />
        </div>
      ))}

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="drive-criteria">Additional Criteria</label>
          <input
            id="drive-criteria"
            name="criteria"
            maxLength={255}
            value={driveForm.criteria}
            onChange={updateField}
            placeholder="e.g. No active backlogs"
          />
          <small>
            Additional criteria are displayed as notes and are
            not checked automatically.
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="drive-status">Status</label>
          <select
            id="drive-status"
            name="status"
            value={driveForm.status}
            onChange={updateField}
          >
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="modal-actions" style={{ marginTop: "1rem" }}>
        <button
          type="button"
          className="cancel-btn"
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="submit-drive-btn"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Drive"}
        </button>
      </div>
    </form>
  );
}