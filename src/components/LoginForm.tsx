export interface LoginFormProps {
  errorMessage?: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const LoginForm = ({ errorMessage, onSubmit }: LoginFormProps) => {
  return (
    <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="mb-6 sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-700">
              Welcome
            </h2>
          </div>
          <form className="space-y-6 mb-8" onSubmit={onSubmit}>
            <div>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Email address"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-xl text-gray-800"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-l font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Log in / Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default LoginForm;
