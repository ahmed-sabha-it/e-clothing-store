import React, { useEffect, useState } from "react";
import { useScrollToTop } from "../../utils/scrollToTop";
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, ArrowRight, Github } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "react-toastify";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import PageTitle from "@/components/PageTitle";
import { authAPI } from "../../lib/api";
const SignIn = () => {
  useScrollToTop();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    
    // Prevent any default form behavior
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    setIsLoading(true);
    
    try {
      const response = await authAPI.login({
        email,
        password,
      });
      
      if (response && response.status && response.data?.token && response.data?.user) {
        // Use auth context to update global state
        login(response.data.token, response.data.user);
        toast.success("Login Successfully!");
        
        // Check if user is admin and navigate accordingly
        if (response.data.user.is_admin || response.data.user.role === 'admin') {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      let message = "An error occurred. Please try again.";
      
      if (error.response && error.response.data && error.response.data.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  useEffect(() => {
    if (isAuthenticated) { 
      navigate('/')
    }
  }, [isAuthenticated, navigate])
  return (
    <div className="flex bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-800 dark:via-gray-900 dark:to-black flex-col min-h-screen">
      <main className="flex-grow flex items-center justify-center  p-4 md:p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 animate-fade-in">
            <PageTitle subtitle="Sign in to continue your creative journey">
              Welcome Back
            </PageTitle>
          </div>

          <Card className="border-border shadow-lg  dark:bg-gray-800 dark:border-gray-700 animate-fade-in animation-delay-150">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-quicksand">Sign In</CardTitle>
              <CardDescription className="font-quicksand">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2  animate-fade-in animation-delay-300">
                  <Label htmlFor="email" className="font-quicksand">Email</Label>
                  <div className="relative ">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className="pl-10 font-quicksand"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    
                    />
                  </div>
                </div>
                <div className="space-y-2 animate-fade-in animation-delay-450">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="font-quicksand">Password</Label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-orange-600 hover:text-orange-500 dark:text-orange-400 dark:hover:text-orange-300 hover:underline inline-flex items-center "
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <TooltipProvider>
                    <div className="relative">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          {showPassword ? (
                            <EyeOff className="absolute left-3 top-3 h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" onClick={togglePasswordVisibility} />
                          ) : (
                            <Eye className="absolute left-3 top-3 h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" onClick={togglePasswordVisibility} />
                          )}
                        </TooltipTrigger>
                        <TooltipContent side="right" className="font-quicksand">{showPassword ? "Hide password" : "Show password"}</TooltipContent>
                      </Tooltip>
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="* * * * * * * *"
                        className="pl-10 font-quicksand"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </TooltipProvider>
                </div>
                
                <div className="animate-fade-in animation-delay-600">
                  <Button
                    type="submit"
                    className="w-full bg-purple-gradient hover:opacity-90 transition-all font-quicksand group"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <Spinner size={16} className="mr-2" />
                        Signing In...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        Sign In
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </Button>
                </div>
              </form>

              
               
               
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 animate-fade-in animation-delay-750">
              <div className="text-center text-sm text-muted-foreground font-quicksand">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-sm text-orange-600 hover:text-orange-500 dark:text-orange-400 dark:hover:text-orange-300 hover:underline inline-flex items-center "
                >
                  Sign Up
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SignIn;