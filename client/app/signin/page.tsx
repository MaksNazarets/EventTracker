"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import API from "../../utils/api";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { loginUser } from "@/lib/slices/userSlice";

export default function SignInPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>("");

  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (user.id > 0) router.replace("/calendar");
  }, [user]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== repeatPassword) {
      setError("The passwords don't match");
      return;
    }

    try {
      const res = await API.post("/register", { email, password, name });
      if (res.status !== 201 && res.data?.error) {
      }

      console.log("Registration successful");

      const loginRes = await dispatch(loginUser({ email, password }));

      const err = loginRes.payload.error;
      if (err) router.push("/login");
    } catch (err: any) {
      if (err.response?.data?.error) {
        setError(err.response?.data?.error);
        return;
      }
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col justify-center gap-5 w-[400px] p-3 md:p-0">
      <h1 className="text-center text-3xl">Sign In</h1>
      <form onSubmit={handleRegister} className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="custom-input"
          required
          autoComplete="name"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="custom-input"
          required
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="custom-input"
          required
          autoComplete="new-password"
        />{" "}
        <input
          type="password"
          placeholder="Confirm password"
          onChange={(e) => setRepeatPassword(e.target.value)}
          className="custom-input"
          required
          autoComplete="new-password"
        />
        {error && (
          <span className="text-red-400 text-xl text-center">{error}</span>
        )}
        <button
          type="submit"
          className="mt-3 text-[1.4rem] bg-gray-700 p-2 rounded-md hover:bg-gray-600 active:bg-gray-700 transition"
        >
          Sign In
        </button>
        <Link
          href="/login"
          className="mt-3 text-center text-xl hover:underline hover:text-gray-300"
        >
          Log In
        </Link>
      </form>
    </div>
  );
}
