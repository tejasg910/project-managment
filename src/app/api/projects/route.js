// app/api/projects/route.js
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
// import data from "@/data/projects.json"
const dataFilePath = path.join(process.cwd(), "src/data", "projects.json");

function getProjects() {
  console.log(dataFilePath)
  const fileContents = fs.readFileSync(dataFilePath, "utf8");
  return JSON.parse(fileContents);
}

function saveProjects(data) {
  console.log("came in sae project")
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8");
}

export async function GET() {
  try {
   const data = getProjects();
    return NextResponse.json(data.projects);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    console.log("came in api ")
    const data = getProjects();
    console.log("data ", data)
    const projectData = await request.json();
    console.log("got data", data, projectData)
    const newProject = {
      id: uuidv4(),
      ...projectData,
    };

    
    data.projects.push(newProject);
    saveProjects(data);
    
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}