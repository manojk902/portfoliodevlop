import React, { useState } from "react";

function For() {
  // state for multiple inputs
  const [education, setEducation] = useState([""]);
  console.log(education);

  const [work, setWork] = useState([""]);

  // handle input change
  const handleChange = (index, value, type) => {
    if (type === "education") {
      const updated = [...education];
      updated[index] = value;
      setEducation(updated);
    } else {
      const updated = [...work];
      updated[index] = value;
      setWork(updated);
    }
  };

  // add new input field
  const handleAdd = (type) => {
    if (type === "education") {
      setEducation([...education, ""]);
    } else {
      setWork([...work, ""]);
    }
  };

  // submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      education,
      work,
    };
    console.log("Payload:", payload);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Form Example</h2>
      <form onSubmit={handleSubmit}>

        {/* Education Section */}
        <h3>Education</h3>
        {education.map((edu, index) => (
          <input
            key={index}
            type="text"
            placeholder="Enter Education"
            value={edu}
            onChange={(e) => handleChange(index, e.target.value, "education")}
            style={{ display: "block", marginBottom: 10 }}
          />
        ))}
        <button type="button" onClick={() => handleAdd("education")}>
          + Add More Education
        </button>

        {/* Work Section */}
        <h3>Work Experience</h3>
        {work.map((job, index) => (
          <input
            key={index}
            type="text"
            placeholder="Enter Work Experience"
            value={job}
            onChange={(e) => handleChange(index, e.target.value, "work")}
            style={{ display: "block", marginBottom: 10 }}
          />
        ))}
        <button type="button" onClick={() => handleAdd("work")}>
          + Add More Work
        </button>

        <br /><br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
export default For;