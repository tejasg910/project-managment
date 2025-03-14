import Navbar from "@/components/Navbar";
import ProjectList from "@/components/ProjectList";


export default async function Dashboard() {

  

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className=" p-6">
            <div className="flex flex-col">
              <ProjectList  />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";