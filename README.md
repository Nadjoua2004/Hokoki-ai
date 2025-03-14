

# **Hokoki AI - React Native App**  

Welcome to the **Hokoki AI** project! This README will guide you through setting up the project, collaborating effectively, and contributing to our AI-powered mobile app.  

## **Project Overview**  
Hokoki AI is a **React Native** application built using **Expo**. Our goal is to develop an intelligent mobile app collaboratively while keeping the codebase clean and well-organized.  

## **Figma Design Link**  
🔗 **Figma Link:** [https://www.figma.com/design/DY1PSRIr8HoeWThbz3PPX3/Hokoki-AI-app?node-id=2008-10&t=jJ7NFySwbU3D4IjW-1]  

## **Getting Started**  

### **1. Prerequisites**  
Before you begin, ensure you have the following installed on your machine:  

- **Node.js** (v18 or above)  
- **npm** (comes with Node.js)  
- **Expo CLI**  

To check if they are installed, run the following commands in your terminal:  

```bash
node -v
npm -v
expo --version
```  

If **Expo CLI** is not installed, install it using:  

```bash
npm install -g expo-cli
```  

### **2. Clone the Repository**  
Open your terminal and navigate to the folder where you want to save the project.  

Clone the repository:  

```bash
git clone https://github.com/YOUR-USERNAME/HokokiAi.git
```  

Navigate to the project directory:  

```bash
cd HokokiAi
```  

### **3. Install Dependencies**  
Run the following command to install all the necessary dependencies:  

```bash
npm install
```  

### **4. Launch the Development Server**  
Start the Expo development server:  

```bash
expo start
```  

After running the command, a QR code will appear in the terminal. Scan it using the **Expo Go** app on your mobile device, or run the app in an emulator.  

---

## **Collaboration Workflow**  
To collaborate on this project, follow these steps:  

### **Step 1: Create a Feature Branch**  
Before making changes, always create a new branch for the feature or bug fix you're working on:  

First, pull the latest changes from the master branch:  

```bash
git pull origin master
```  

Create a new branch for your feature:  

```bash
git checkout -b feature-<feature-name>
```  

(Replace `<feature-name>` with a descriptive name, e.g., `feature-login-ui`.)  

### **Step 2: Work on Your Feature**  
Make changes in your local environment and test your code thoroughly. Regularly commit your changes with meaningful messages:  

```bash
git add .
git commit -m "Add <description-of-change>"
```  

(Example: `"Add login screen UI"`)  

### **Step 3: Push Your Feature Branch**  
Push your branch to GitHub:  

```bash
git push origin feature-<feature-name>
```  

### **Step 4: Create a Pull Request**  
1. Go to **GitHub** → **Pull Requests**.  
2. Click on **"New Pull Request"**.  
3. Set the base branch to `master` and compare it with your feature branch.  
4. Click **"Create Pull Request"**.  
5. Add a description explaining your changes and submit the PR.  

### **Step 5: Address Feedback**  
If there’s feedback on your pull request:  
- Make the requested changes on your local branch.  
- Push the updates:  

```bash
git add .
git commit -m "Update based on feedback"
git push origin feature-<feature-name>
```  

Your pull request will automatically update with the new commits.  

---
🚨 Important Notes to Prevent Conflicts
To ensure smooth collaboration and avoid unnecessary issues, please follow these guidelines:

❌ Do NOT install random packages – Only install dependencies after discussing them with the team.

❌ Do NOT modify configuration files – Files like package.json, app.json, babel.config.js, etc., should not be changed unless necessary and approved by the team.

❌ Do NOT modify App.js – This file is used as the main entry point. If changes are needed, discuss them first to prevent conflicts.

✅ Always work in a separate branch – Never push directly to main.

✅ Communicate with the team – If you're making major changes, let everyone know in the group chat or project discussion.

## **Additional Notes**  
- Always **pull the latest changes** before starting new work.  
- Use **meaningful commit messages** for better tracking.  
- Follow the **code style guidelines** to keep the code clean and readable.


Happy coding! 🚀🎉  

---
