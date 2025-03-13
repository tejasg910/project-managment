// app/api/projects/[id]/route.js
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Path to JSON file
const dataFilePath = path.join(process.cwd(), "src/data", "projects.json");

// Helper function to read project data
function getProjects() {
  const fileContents = fs.readFileSync(dataFilePath, "utf8");
  return JSON.parse(fileContents);
}

// Helper function to write project data
function saveProjects(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8");
}

// GET - Get a specific project
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

// PUT - Update a specific project
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = getProjects();
    const updatedFields = await request.json();
    
    const projectIndex = data.projects.findIndex(p => p.id === id);
    
    if (projectIndex === -1) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }
    
    // Update project fields
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

// DELETE - Delete a specific project
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
    
    // Remove the project
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