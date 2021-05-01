import { useEffect, useState } from "react";

const Fib = () => {
  const [formValue, setFormValue] = useState("");
  const [seenIndexes, setSeenIndexes] = useState([]);
  const [values, setValues] = useState<any>({});
  const [fetchFlag, setFetchFlag] = useState(false);

  const fetchValues = () => {
    fetch("/api/values/current")
      .then((response) => response.json())
      .then((data) => {
        setValues(data);
      });
  };

  const fetchIndexes = () => {
    fetch("/api/values")
      .then((res) => res.json())
      .then((response) => setSeenIndexes(response));
  };

  useEffect(() => {
    fetchValues();
    fetchIndexes();
  }, [fetchFlag]);

  const handleClick = () => {
    fetch("/api/values", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ index: formValue }),
    })
      .then((response) => response.json())
      .then((res) => {
        setFormValue("");
        setFetchFlag(!fetchFlag);
      });
  };
  const renderIndexes = () => {
    return seenIndexes.map(({ number }) => number).join(",");
  };

  const renderValues = () => {
    const entries = [];
    for (let key in values) {
      entries.push(
        <div>
          For Index {key} I calculated {values[key]}
        </div>
      );
    }
    return entries;
  };
  return (
    <div>
      <label>Enter Your Index: </label>
      <input
        type="text"
        value={formValue}
        onChange={(e) => setFormValue(e.target.value)}
      />
      <button onClick={handleClick}>Find</button>
      <h3>Indicies I have seen:</h3>
      {renderIndexes()}
      <h3>Calculated Values: </h3>
      {renderValues()}
    </div>
  );
};

export default Fib;
