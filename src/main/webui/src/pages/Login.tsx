import { useLocation } from "react-router";
import { Alert, Typography } from "@material-tailwind/react";
import { PageLayout } from "../ui-component/PageLayout";
import { useState } from "react";
import CustomFormButton from "../ui-component/CustomFormButton";
import { GradientCard } from '../ui-component/GradientCard';
import { FormInput } from '../ui-component/FormInput';
import { GRADIENT_CLASSES } from '../constants/styles';
import { 
    Lock, 
    AlertTriangle, 
    User, 
    Eye, 
    EyeOff, 
    LogIn
} from "lucide-react";
import { motion } from "framer-motion";

function Login() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const hasError = params.get("error") === "true";
    const [showPassword, setShowPassword] = useState(false);

    const passwordToggle = (
        <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-400 hover:text-gray-600"
        >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
    );

    const footer = (
        <Typography variant="small" className="flex justify-center items-center text-gray-600 dark:text-gray-400">
            Don't have an account?
            <Typography
                as="a"
                href="/register"
                className="ml-2 font-bold text-purple-600 hover:text-purple-700 hover:underline transition-colors duration-200"
            >
                Register Here
            </Typography>
        </Typography>
    );

    return (
        <PageLayout pageTitle="Welcome Back!" contentMaxWidth="max-w-md">
            <GradientCard
                title="Welcome Back"
                subtitle="Sign in to continue"
                icon={Lock}
                footer={footer}
            >
                {hasError && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <Alert color="error" className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" />
                            Invalid username or password. Please try again.
                        </Alert>
                    </motion.div>
                )}

                <form action="/j_security_check" method="post" className="flex flex-col gap-5">
                    <FormInput
                        type="text"
                        placeholder="Username"
                        name="j_username"
                        icon={User}
                        required
                    />

                    <FormInput
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        name="j_password"
                        icon={Lock}
                        rightElement={passwordToggle}
                        required
                    />

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <CustomFormButton
                            type="submit"
                            className={`w-full ${GRADIENT_CLASSES.primaryButton} py-4 flex items-center justify-center gap-2`}
                        >
                            <LogIn className="h-5 w-5" />
                            Sign In
                        </CustomFormButton>
                    </motion.div>
                </form>
            </GradientCard>
        </PageLayout>
    );
}

export default Login;