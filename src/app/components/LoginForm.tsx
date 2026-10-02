"use client";

import { useRouter } from "next/navigation";
import { type ChangeEvent, useState } from "react";
import Login from "../types/Login";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AuthService from "../service/AuthService";
import { useAuthStore } from "../stores/UserStore";

export default function LoginForm() {
    const initialLoginState = { username: "", password: "" };
    const [login, setLogin] = useState<Login>(initialLoginState);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setLogin({ ...login, [name]: value });
    };

    const onClickSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await AuthService.login(login);
            setAuth(response.data);
            router.push("/dashboard");
        } catch (loginError) {
            setError(loginError instanceof Error ? loginError.message : "Unable to log in.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Box component="form" onSubmit={onClickSubmit}>
            <Card>
                <CardContent>
                    <Typography variant="h4" sx={{ textAlign: "center" }}>
                        Login
                    </Typography>
                    {error && <Alert severity="error">{error}</Alert>}
                    <Stack spacing={2}>
                        <FormControl variant="standard">
                            <InputLabel htmlFor="usernameInput">
                                Username
                            </InputLabel>
                            <Input
                                id="usernameInput"
                                name="username"
                                value={login.username}
                                onChange={handleInputChange}
                                autoComplete="username"
                            />
                        </FormControl>
                        <FormControl variant="standard">
                            <InputLabel htmlFor="passwordInput">
                                Password
                            </InputLabel>
                            <Input
                                id="passwordInput"
                                name="password"
                                fullWidth
                                value={login.password}
                                onChange={handleInputChange}
                                type="password"
                                autoComplete="current-password"
                            />
                        </FormControl>
                    </Stack>
                </CardContent>
                <CardActions sx={{ justifyContent: "center" }}>
                    <Button
                        variant="contained"
                        loading={loading}
                        type="submit"
                    >
                        Login
                    </Button>
                </CardActions>
            </Card>
        </Box>
    );
}
