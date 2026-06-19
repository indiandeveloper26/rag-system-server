// import { Chroma } from "@langchain/community/vectorstores/chroma";
// import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
// import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
// import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

// export const setupRAG = async (req, res) => {
//     try {
//         console.log("🚀 Ingestion process started...");

//         // 1. PDF Load karein
//         const loader = new PDFLoader("./test.pdf");
//         const docs = await loader.load();
//         console.log("📄 PDF Loaded successfully");

//         // 2. Chunks banayein
//         const splitter = new RecursiveCharacterTextSplitter({
//             chunkSize: 500,
//             chunkOverlap: 50
//         });
//         const rawChunks = await splitter.splitDocuments(docs);

//         // 3. Metadata Fix (ChromaDB validation ke liye)
//         const chunks = rawChunks.map(chunk => ({
//             ...chunk,
//             metadata: {
//                 source: "test.pdf",
//                 loc: JSON.stringify(chunk.metadata.loc || {})
//             }
//         }));

//         // 4. Embedding Model
//         const embeddings = new GoogleGenerativeAIEmbeddings({
//             apiKey: "AIzaSyD2SAimp5DXPVfejaek7K8zittN-GuJF2A", // Ideally use process.env
//             modelName: "embedding-001",
//         });

//         // 5. Save to Chroma
//         console.log("⏳ Saving to ChromaDB...");
//         await Chroma.fromDocuments(chunks, embeddings, {
//             collectionName: "user",
//             url: "http://localhost:8000",
//         });

//         // ✅ Final Response (Pura kaam hone ke baad)
//         res.status(200).json({
//             success: true,
//             message: "Data processed and saved successfully!",
//             totalChunks: chunks.length
//         });

//     } catch (error) {
//         console.error("❌ Error detail:", error.message);
//         res.status(500).json({
//             success: false,
//             error: "Ingestion Failed",
//             details: error.message
//         });
//     }
// };







import { QdrantVectorStore } from "@langchain/qdrant";

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import axios from "axios";
import fs from "fs";
import path from "path";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

export const setupRAG = async (req, res) => {


    try {
        console.log("🚀 Ingestion process started...");


        console.log("QDRANT_URL =", process.env.QDRANT_URL);
        console.log("QDRANT_API_KEY =", process.env.QDRANT_API_KEY);

        // PDF URL API se lo
        const pdfUrl = req.body.pdfUrl;

        if (!pdfUrl) {
            return res.status(400).json({
                success: false,
                message: "PDF URL required"
            });
        }

        console.log('pdg geting')


        // 1. PDF Download karo
        const pdfPath = path.join(process.cwd(), "temp.pdf");

        const response = await axios({
            method: "GET",
            url: pdfUrl,
            responseType: "stream",
        });


        const writer = fs.createWriteStream(pdfPath);

        response.data.pipe(writer);


        await new Promise((resolve, reject) => {
            writer.on("finish", resolve);
            writer.on("error", reject);
        });


        console.log("📥 PDF Downloaded");


        // 2. PDF Load
        const loader = new PDFLoader(pdfPath);

        const docs = await loader.load();

        console.log("📄 PDF Loaded");


        // 3. Chunking
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 500,
            chunkOverlap: 50
        });



        const rawChunks = await splitter.splitDocuments(docs);

        console.log("Total raw chunks:", rawChunks.length);


        // Empty chunks remove
        const chunks = rawChunks
            .filter(chunk =>
                chunk.pageContent &&
                chunk.pageContent.trim().length > 20
            )
            .map(chunk => ({
                ...chunk,
                metadata: {
                    source: pdfUrl,
                    loc: JSON.stringify(chunk.metadata.loc || {})
                }
            }));


        console.log("Valid chunks:", chunks.length);

        console.log(
            "First chunk:",
            chunks[0]?.pageContent
        );



        console.log('ameding staring...', process.env.GOOGLE_API_KEY)

        // 5. Embedding
        const embeddings = new GoogleGenerativeAIEmbeddings({
            apiKey: process.env.GOOGLE_API_KEY,
            model: "gemini-embedding-001",
        });


        const testEmbedding = await embeddings.embedQuery("hello world");

        console.log("Embedding length:", testEmbedding.length);
        console.log(testEmbedding.slice(0, 5));



        // // 6. Chroma save
        // await Chroma.fromDocuments(
        //     chunks,
        //     embeddings,
        //     {
        //         collectionName: "ragpdf",
        //         host: "localhost",
        //         port: 8000,
        //     }
        // );



        const vectorStore = await QdrantVectorStore.fromDocuments(
            chunks,
            embeddings,
            {
                url: process.env.QDRANT_URL,
                apiKey: process.env.QDRANT_API_KEY,
                collectionName: "ragsystem",
                checkCompatibility: false,
            }
        );


        // temp delete
        fs.unlinkSync(pdfPath);


        console.log('PDF processed successfully')


        res.json({
            success: true,
            message: "PDF processed successfully",
            totalChunks: chunks.length
        });



    } catch (error) {

        console.log("❌ Error:", error.message);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};