import { useState } from "react";

interface InputProps {
  onSubmit: (message: string) => void;
}

const Input = ({ onSubmit }: InputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    onSubmit(message);
  };

  return (
    <>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        cols={50}
        rows={10}
        placeholder="Enter your message"
      ></textarea>
      <button onClick={handleSubmit}>Send</button>
    </>
  );
};

export default Input;
