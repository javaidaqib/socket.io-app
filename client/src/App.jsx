import { useEffect, useMemo, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Checkbox,
} from "@mui/material";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

function App() {
  const socket = useMemo(() => io("http://localhost:4000"), []);

  const [message, setMessage] = useState("");
  const [socketId, setSocketId] = useState("");
  const [room, setRoom] = useState("");
  const [isPrivateMsg, setIsPrivateMsg] = useState(false);

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
    });

    socket.on("welcome", (data) => {
      console.log(data);
    });

    socket.on("emit-msg", (data) => {
      console.log("emit-msg : ", data);
      toast.success(`${data.socketId} : ${data.message}`);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room, socketId });
    setMessage("");
  };

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        py: "2rem",
      }}
      maxWidth="lg"
    >
      <Typography variant="h3" component="div" gutterBottom>
        Welcome to the Chat App
      </Typography>

      <Typography variant="h6" component="div" gutterBottom>
        Your Socket ID is: <strong>{socketId}</strong>
      </Typography>

      {/* form */}
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
          marginTop: "3rem",
        }}
        onSubmit={handleSubmit}
      >
        <TextField
          id="outlined-basic"
          label="Write a message..."
          variant="outlined"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <TextField
          id="outlined-basic"
          disabled={!isPrivateMsg}
          label="Enter the room..."
          variant="outlined"
          required={false}
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <Typography
          sx={{ display: "flex", alignItems: "center" }}
          variant="par"
          component="div"
          gutterBottom
        >
          <Checkbox
            checked={isPrivateMsg}
            onChange={() => {
              setIsPrivateMsg(event.target.checked);
              setRoom("");
            }}
            inputProps={{ "aria-label": "controlled" }}
          />{" "}
          Turn on the Private Message
        </Typography>

        <Button
          type="submit"
          sx={{ width: "60px" }}
          variant="contained"
          color="primary"
        >
          Send
        </Button>
      </form>
    </Container>
  );
}

export default App;
