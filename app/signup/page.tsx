import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import SignupForm from "@/components/SignupForm";

export default async function SignupPage() {
  const { user } = await validateRequest();
  
  if (user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your JobFlow account
          </h2>
        </div>
        <SignupForm />
        <div className="text-center">
          <a href="/login" className="text-sm text-blue-600 hover:text-blue-500">
            Already have an account? Sign in
          </a>
        </div>
      </div>
    </div>
  );
}

