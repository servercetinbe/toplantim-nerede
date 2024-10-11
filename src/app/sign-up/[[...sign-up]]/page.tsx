import { SignUp } from "@clerk/nextjs";
import { Box, Container, Paper, Typography } from "@mui/material";

export default function SignUpPage(): JSX.Element {
  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Sign Up
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            padding: "20px",
          }}
        >
          <SignUp
            appearance={{
              elements: {
                card: "shadow-md rounded-lg",
                formFieldInput: "p-2 border rounded-lg",
                formButtonPrimary: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",
              },
            }}
            path="/sign-up"
            routing="path"
            signInUrl="/sign-in"
          />
        </Box>
      </Paper>
    </Container>
  );
}
