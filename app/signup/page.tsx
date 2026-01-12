import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import SignupForm from "@/components/SignupForm";
import Logo from "@/components/Logo";

export default async function SignupPage() {
  const { user } = await validateRequest();
  
  if (user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="px-8 pt-8 pb-6">
            <div className="flex justify-center mb-6">
              <Logo className="w-44 h-auto" />
            </div>
            <h2 className="text-center text-2xl font-bold text-gray-900 mb-2">
              Create your account
            </h2>
            <p className="text-center text-sm text-gray-600 mb-8">
              Get started with JobFlow today
            </p>
            <SignupForm />
          </div>
          <div className="px-8 pb-8 pt-4 bg-gray-50 border-t border-gray-200">
            <div className="text-center">
              <a href="/login" className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors">
                Already have an account? <span className="font-semibold">Sign in</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

