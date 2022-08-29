import React, { ReactElement, useState } from "react";

const useInput = (initValue: string) => {
  const [value, setValue] = useState<string>(initValue);

  const onChange = (e: React.ChangeEvent<any>) => {
    const { value } = e.target;
    setValue(value);
  };

  return { value, setValue, onChange };
};

export default useInput;
