import { useEffect, useMemo, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Checkbox,
  Stack,
  Paper,
  Box,
} from "@mui/material";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { styled } from "@mui/material/styles";

const Item = styled(Paper)(() => ({
  backgroundColor: "#757de8",
  padding: "8px 16px",
  textAlign: "center",
  color: "white",
  flexGrow: 1,
}));

function App() {
  const socket = useMemo(() => io("http://localhost:4000"), []);

  const [message, setMessage] = useState("");
  const [socketId, setSocketId] = useState("");
  const [room, setRoom] = useState("");
  const [messages, setMessages] = useState([]);
  const [isPrivateMsg, setIsPrivateMsg] = useState(false);
  const [chatRoom, setChatRoom] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
    });

    socket.on("welcome", (data) => {
      console.log(data);
    });

    socket.on("emit-msg", (data) => {
      setMessages((prevState) => [
        ...prevState,
        { message: data.message, from: data.socketId },
      ]);
      toast.success(`${data.socketId} : ${data.message}`);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleRoomSubmit = (e) => {
    e.preventDefault();
    socket.emit("join-chatRoom", chatRoom);
    toast.success(`Chat Room ${chatRoom} is created!`);
    setChatRoom("");
  };

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

      {/* Room Form */}
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
          marginTop: "3rem",
        }}
        onSubmit={(e) => handleRoomSubmit(e)}
      >
        <TextField
          id="outlined-basic"
          label="Enter Chat Room name..."
          variant="outlined"
          value={chatRoom}
          onChange={(e) => setChatRoom(e.target.value)}
        />

        <Button
          type="submit"
          sx={{ width: "160px" }}
          variant="contained"
          color="primary"
          disabled={!chatRoom}
        >
          Join Room
        </Button>
      </form>

      {/* Msg Form */}
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
          disabled={!message}
        >
          Send
        </Button>
      </form>

      {messages.length > 0 ? (
        <Stack
          direction="column"
          sx={{
            bgcolor: "#becbd6",
            p: "12px",
            width: "60%",
            my: "2rem",
          }}
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          {messages.map((data, ind) => (
            <Item key={ind}>
              <strong>{data.message}</strong> - {data.from}
            </Item>
          ))}
        </Stack>
      ) : null}
    </Container>
  );
}

export default App;
