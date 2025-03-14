import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "src/data", "projects.json");

function getProjects() {
  const fileContents = fs.readFileSync(dataFilePath, "utf8");
  return JSON.parse(fileContents);
}

function saveProjects(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8");
}

export async function GET(request, { params }) {
  try {
    const { id } = await params;


    const data = getProjects();
    
    const project = data.projects.find(p => p.id === id);
    
    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const data = getProjects();
    const updatedFields = await request.json();


    console.log(updatedFields, "This is updated fields")
    
    const projectIndex = data.projects.findIndex(p => p.id === id);
    
    if (projectIndex === -1) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }
    
    data.projects[projectIndex] = {
      ...data.projects[projectIndex],
      ...updatedFields,
    };
    
    saveProjects(data);
    
    return NextResponse.json(data.projects[projectIndex]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const data = getProjects();
    
    const projectIndex = data.projects.findIndex(p => p.id === id);
    
    if (projectIndex === -1) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }
    
    data.projects.splice(projectIndex, 1);
    saveProjects(data);
    
    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}