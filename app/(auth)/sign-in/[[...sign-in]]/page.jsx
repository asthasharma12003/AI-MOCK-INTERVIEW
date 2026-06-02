import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        
        {/* LEFT SECTION */}
        <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
          {/* <img
            alt="AI Interview"
            src="https://www.southmoorschool.co.uk/wp-content/uploads/job_interview_illustration.jpg"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          /> */}
          <img
  src="/images.jpg"
  alt="AI Interview"
  className="absolute inset-0 h-full w-full object-cover opacity-80"
/>

          <div className="hidden lg:relative lg:block lg:p-12">
            <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              Welcome to AI Interview 📊
            </h2>

            <p className="mt-4 leading-relaxed text-white/90">
              AI Mock Interview is an AI-powered platform that simulates real job interviews.
              It helps users practice role-based questions, improve communication skills,
              and build confidence before real interviews.
            </p>
          </div>
        </section>

        {/* RIGHT SECTION */}
        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">

            <div className="relative -mt-16 block lg:hidden">
              <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl dark:text-white">
                Welcome to AI Interview 📊
              </h1>

              <p className="mt-4 leading-relaxed text-gray-500 dark:text-gray-400">
                AI Mock Interview helps you practice real interview questions using AI
                and improve your confidence and skills.
              </p>
            </div>

            <SignIn />
          </div>
        </main>

      </div>
    </section>
  );
}