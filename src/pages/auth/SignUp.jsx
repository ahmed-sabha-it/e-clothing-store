import React, { useEffect, useState } from "react";
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
// import { toast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, User, ArrowRight, Github,  CloudCog, Check, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ToastContainer, toast } from 'react-toastify';
import PageTitle from "@/components/PageTitle";
// import  ScrollToTop  from "../../utils/scrollToTop"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { authAPI } from "../../lib/api";
// import { title } from "process";
import Cookies from 'js-cookie'
const SignUp = () => {
  // useScrollToTop();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });
  const navigate = useNavigate();
  // Validate password requirements
  const validatePassword = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    setPasswordRequirements(requirements);
    return Object.values(requirements).every(Boolean);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!acceptTerms) {
      toast.error("Please accept the Terms and Privacy Policy to continue.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match. Please make sure your passwords match.");
      return;
    }

    if (!isPasswordValid) {
      toast.error("Password does not meet the required criteria. Please check the requirements below.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authAPI.register({
        name,
        email,
        password,
        password_confirmation: confirmPassword
      });
      setIsLoading(false);
      // toast({
      //   title: "Account created!",
      //   description: "Welcome to Purplefolio! Let's create your first portfolio.",
      // });
      toast.success("register has done suussussfuly")
      setTimeout(() => {
        navigate("/signin"); // Redirect to home page
      }, 500);
    } catch (error) {
      console.log(error)

      // if(error.)
      setIsLoading(false);
      if (error.message == "Network Error") {
        toast.error("you don,t have a connection with internet")
      }
      if (error.message == "Request failed with status code 422") {
        toast.error("this email has been taken")
      }
      console.log(error.message)
      let message = "Something went wrong. Please try again.";
      if (error.response && error.response.data) {
        if (typeof error.response.data === "string") {
          message = error.response.data;
        } else if (error.response.data.message) {
          message = error.response.data.message;
        } else if (error.response.data.errors) {
          // Laravel validation errors
          const errors = error.response.data.errors;
          message = Object.values(errors).flat().join(" ");
        }
      }
     
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  useEffect(() => {
    if (Cookies.get("token")) { 
      navigate('/')
    }
  }, [])
  return (
    <div className="flex flex-col bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-800 dark:via-gray-900 dark:to-black min-h-screen">
      <ToastContainer />
      <main className="flex-grow flex items-center  justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 animate-fade-in">
            <PageTitle subtitle="Create an account to showcase your creative work">
              Join Chicora
            </PageTitle>
          </div>

          <Card className="border-border shadow-lg animate-fade-in dark:bg-gray-800 dark:border-gray-700 animation-delay-150">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-quicksand">Sign Up</CardTitle>
              <CardDescription className="font-quicksand">
                Enter your details to create your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2 animate-fade-in animation-delay-300">
                  <Label htmlFor="name" className="font-quicksand">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      className="pl-10 font-quicksand"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2 animate-fade-in animation-delay-450">
                  <Label htmlFor="email" className="font-quicksand">Email</Label>
                  <div className="relative">
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

                <div className="space-y-2 animate-fade-in animation-delay-600">
                  <Label htmlFor="password" className="font-quicksand">Password</Label>
                  <div className="relative">
                    <TooltipProvider>
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
                    </TooltipProvider>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="* * * * * * * *"
                      className="pl-10 font-quicksand"
                      value={password}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                  {/* Password Requirements */}
                  <div className="bg-muted/50 p-3 rounded-lg space-y-2">
                    <h4 className="font-medium text-sm mb-2 font-quicksand">Password Requirements:</h4>
                    <div className="grid grid-cols-1 gap-1 text-xs">
                      <div className={`flex items-center space-x-2 font-quicksand ${
                        passwordRequirements.length ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'
                      }`}>
                        {passwordRequirements.length ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <X className="w-3 h-3" />
                        )}
                        <span>At least 8 characters</span>
                      </div>
                      <div className={`flex items-center space-x-2 font-quicksand ${
                        passwordRequirements.uppercase ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'
                      }`}>
                        {passwordRequirements.uppercase ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <X className="w-3 h-3" />
                        )}
                        <span>One uppercase letter (A-Z)</span>
                      </div>
                      <div className={`flex items-center space-x-2 font-quicksand ${
                        passwordRequirements.lowercase ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'
                      }`}>
                        {passwordRequirements.lowercase ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <X className="w-3 h-3" />
                        )}
                        <span>One lowercase letter (a-z)</span>
                      </div>
                      <div className={`flex items-center space-x-2 font-quicksand ${
                        passwordRequirements.number ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'
                      }`}>
                        {passwordRequirements.number ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <X className="w-3 h-3" />
                        )}
                        <span>One number (0-9)</span>
                      </div>
                      <div className={`flex items-center space-x-2 font-quicksand ${
                        passwordRequirements.special ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'
                      }`}>
                        {passwordRequirements.special ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <X className="w-3 h-3" />
                        )}
                        <span>One special character (!@#$%^&*)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 animate-fade-in animation-delay-750">
                  <Label htmlFor="confirmPassword" className="font-quicksand">Confirm Password</Label>
                  <div className="relative">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          {showConfirmPassword ? (
                            <EyeOff className="absolute left-3 top-3 h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" onClick={toggleConfirmPasswordVisibility} />
                          ) : (
                            <Eye className="absolute left-3 top-3 h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" onClick={toggleConfirmPasswordVisibility} />
                          )}
                        </TooltipTrigger>
                        <TooltipContent side="right" className="font-quicksand">{showConfirmPassword ? "Hide password" : "Show password"}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="* * * * * * * *"
                      className="pl-10 font-quicksand"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 animate-fade-in animation-delay-900">
                  <Checkbox id="terms" checked={acceptTerms} onCheckedChange={setAcceptTerms} required />
                  <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-quicksand">
                    I agree to the <Link to="/terms" className="text-sm text-orange-600 hover:text-orange-500 dark:text-orange-400 dark:hover:text-orange-300 hover:underline inline-flex items-center ">Terms of Service</Link> and <Link to="/privacy" className="text-sm text-orange-600 hover:text-orange-500 dark:text-orange-400 dark:hover:text-orange-300 hover:underline inline-flex items-center ">Privacy Policy</Link>
                  </label>
                </div>

                <div className="animate-fade-in animation-delay-1050">
                  <Button
                    type="submit"
                    className="w-full bg-purple-gradient hover:opacity-90 transition-all font-quicksand group"
                    disabled={isLoading || !isPasswordValid || password !== confirmPassword || !acceptTerms}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <Spinner size={16} className="mr-2" />
                        Creating Account...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        Create Account
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </Button>
                </div>
              </form>

             
              </CardContent>
            <CardFooter className="flex flex-col space-y-4 animate-fade-in animation-delay-1200">
              <div className="text-center text-sm text-muted-foreground font-quicksand">
                Already have an account?{" "}
                <Link
                  to="/signin"
                  className="text-sm text-orange-600 hover:text-orange-500 dark:text-orange-400 dark:hover:text-orange-300 hover:underline inline-flex items-center  "
                >
                  Sign In
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SignUp;