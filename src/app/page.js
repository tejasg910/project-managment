// app/dashboard/page.js
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProjectList from "@/components/ProjectList";
import fs from "fs";
import path from "path";
import { currentUser } from '@clerk/nextjs/server'

export default async function Dashboard() {
  const user = await currentUser()
  
  if (!user) {
    redirect("/");
  }
  
  // Get projects from JSON file

  const dataFilePath = path.join(process.cwd(), "src/data", "projects.json");
  const fileContents = fs.readFileSync(dataFilePath, "utf8");
  const { projects } = JSON.parse(fileContents);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex flex-col">
              <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
              <ProjectList projects={projects} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";