import PDFDocument from "pdfkit";
import fs from "fs";


const doc = new PDFDocument({
  size: "A4",
  margin: 50
});


const output =
  fs.createWriteStream("Sahil_Kumar_Profile.pdf");


doc.pipe(output);



// ===============================
// HEADER
// ===============================


doc
  .fillColor("#1e1b4b")
  .fontSize(24)
  .text(
    "Sahil Kumar - Developer Profile",
    {
      align: "center"
    }
  );


doc
  .fontSize(12)
  .fillColor("#475569")
  .text(
    "AI Engineer | Full Stack Developer | Node.js Developer",
    {
      align: "center"
    }
  );


doc.moveDown();

doc.moveTo(50, doc.y)
  .lineTo(545, doc.y)
  .strokeColor("#cbd5e1")
  .stroke();


doc.moveDown(2);



// ===============================
// SECTION HELPER
// ===============================


const addSection = (title, content) => {


  doc
    .fillColor("#312e81")
    .fontSize(15)
    .text(title);


  doc.moveDown(.5);


  doc
    .fillColor("#1e293b")
    .fontSize(11);


  content.forEach(item => {


    doc.text(item, {
      paragraphGap: 8,
      lineGap: 4,
      align: "justify"
    });


  });


  doc.moveDown(1.5);


};




// ===============================
// PERSONAL INFO
// ===============================


addSection(
  "1. PERSONAL INFORMATION",
  [

    "Name: Sahil Kumar",

    "Role: Full Stack Developer & AI Application Developer",

    "Primary Technologies: Node.js, React, MongoDB, AI/LLM Integration",

    "Developer Focus: Building scalable backend systems, AI chatbots, automation tools and trading applications."

  ]
);





// ===============================
// SKILLS
// ===============================


addSection(
  "2. TECHNICAL SKILLS",
  [

    "Backend Development:",
    "• Node.js",
    "• Express.js",
    "• REST API Development",
    "• Authentication Systems",
    "• Background Jobs with BullMQ",


    "Frontend Development:",
    "• React.js",
    "• Next.js",
    "• Expo React Native",
    "• Modern UI Development",


    "Database:",
    "• MongoDB",
    "• Vector Database ChromaDB",
    "• Data Modeling",


    "Artificial Intelligence:",
    "• RAG Architecture",
    "• LLM Integration",
    "• Gemini Embeddings",
    "• Groq LLM",
    "• AI Chatbot Development"

  ]
);





// ===============================
// PROJECTS
// ===============================


addSection(
  "3. PROJECT EXPERIENCE",
  [


    "AI PDF RAG Chatbot",

    "Created an AI assistant that reads PDF documents, converts data into embeddings, stores vectors in ChromaDB and answers user questions using LLM models.",



    "Technology Used:",
    "Node.js, LangChain, Gemini Embeddings, ChromaDB, Groq Llama Models",



    "Crypto Trading Bot",

    "Developed automated trading systems using APIs, technical indicators and machine learning based strategies.",



    "Technology Used:",
    "Node.js, Exchange APIs, Technical Indicators, Telegram Alerts",




    "Social Media Automation Platform",

    "Built automation systems for managing social media posts, scheduling content and integrating APIs.",



    "Technology Used:",
    "Node.js, APIs, Background Workers, Database Systems"

  ]
);






// ===============================
// AI KNOWLEDGE
// ===============================


addSection(
  "4. AI AND MACHINE LEARNING WORK",

  [

    "Sahil works on Generative AI applications.",

    "Experience with Retrieval Augmented Generation (RAG) pipelines.",

    "Builds systems where user questions are analyzed by AI agents, relevant information is searched from vector databases and final answers are generated using Large Language Models.",


    "AI Stack:",
    "LangChain, Gemini API, Groq LLM, Vector Search, Embeddings"

  ]
);






// ===============================
// CURRENT DEVELOPMENT
// ===============================


addSection(
  "5. CURRENT DEVELOPMENT",

  [

    "Currently building advanced AI-powered applications using Node.js backend architecture.",


    "Working on intelligent assistants capable of understanding documents and providing contextual answers.",


    "Focus areas:",
    "• AI Agents",
    "• RAG Systems",
    "• Automation",
    "• Scalable APIs"

  ]
);





// ===============================
// END
// ===============================


doc
  .fillColor("#64748b")
  .fontSize(10)
  .text(
    "Generated Developer Profile Document - 2026",
    {
      align: "center"
    }
  );



doc.end();



output.on(
  "finish",
  () => {

    console.log(
      "✅ Sahil_Kumar_Profile.pdf Created"
    );

  }
);