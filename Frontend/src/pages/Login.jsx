("use client");
import React, { useContext, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  IconBrandGithub,
  IconBrandGoogle,
  // IconBrandOnlyfans,
} from "@tabler/icons-react";
import { IoEye, IoEyeOff, IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthDataContext } from "../Context/AuthContext";
import { UserDataContext } from "@/Context/UserContext";

function Login() {
  let [show, setShow] = useState(false);
  const navigate = useNavigate();

  const { serverUrl, loading, setLoading } = useContext(AuthDataContext);
  const { getCurrentUser } = useContext(UserDataContext);

  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await axios.post(serverUrl + "/auth/login", {
        email,
        password,
      });

      const { jwt } = result.data;
      localStorage.setItem("token", jwt);

      // fetch logged-in user & update context
      await getCurrentUser();

      setLoading(false);
      navigate("/");
      // window.location.reload();
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="relative min-h-screen">
      <div
        className="absolute top-14 left-[100px] w-[100px] h-[40px] bg-[#FF4163] hover:bg-[#AA001F] duration-200 cursor-pointer border-2 text-lg rounded-2xl flex justify-center items-center text-white"
        onClick={() => navigate("/")}
      >
        <IoArrowBackOutline className="w-[25px] h-[25px] text-white" />
      </div>
      <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
          Login
        </h2>
        <p className="mt-2 max-w-sm text-sm text-black dark:text-neutral-300 text-xl">
          Welcome to DesiNest
        </p>
        <form className="my-8" onSubmit={handleLogin}>
          <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2"></div>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              placeholder="projectmayhem@fc.com"
              type="email"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              onSubmit={handleLogin}
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4 relative">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="••••••••"
              type={show ? "text" : "password"}
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              onSubmit={handleLogin}
            />
            {!show && (
              <IoEye
                className="absolute right-[6%] bottom-[20px] cursor-pointer"
                onClick={() => setShow((prev) => !prev)}
              />
            )}
            {show && (
              <IoEyeOff
                className="absolute right-[6%] bottom-[20px] cursor-pointer"
                onClick={() => setShow((prev) => !prev)}
              />
            )}
          </LabelInputContainer>

          <button
            className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] border-2 hover:cursor-pointer hover:text-black hover:bg-green-400 duration-200 delay-100"
            type="submit"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login  →"}
            <BottomGradient />
          </button>
          <p className="mt-5">
            Create a account
            <span
              className="text-blue-600 cursor-pointer p-2 hover:underline"
              onClick={() => navigate("/signup")}
            >
              SignUp
            </span>
          </p>

          <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

          <div className="flex flex-col space-y-4">
            <button
              className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626] hover:scale-x-95 cursor-pointer"
              type="submit"
            >
              <IconBrandGithub className="h-4 w-4 text-white dark:text-neutral-300" />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                GitHub
              </span>
              <BottomGradient />
            </button>
            <button
              className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626] hover:scale-x-95 cursor-pointer"
              type="submit"
            >
              <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                Google
              </span>
              <BottomGradient />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};

export default Login;
