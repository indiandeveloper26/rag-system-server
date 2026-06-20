import { QdrantVectorStore } from "@langchain/qdrant";
import { QdrantClient } from "@qdrant/js-client-rest";

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

import axios from "axios";
import fs from "fs";
import path from "path";



export const Raguplaod = async (req, res) => {

    let pdfPath = null;


    try {


        console.log("🚀 RAG Upload Started");


        const {
            pdfUrl
        } = req.body;



        if (!pdfUrl) {

            return res.status(400).json({
                success: false,
                message: "PDF URL required"
            });

        }



        /*
        ===============================
        QDRANT CLIENT
        ===============================
        */


        const qdrantClient = new QdrantClient({

            url: process.env.QDRANT_URL,

            apiKey: process.env.QDRANT_API_KEY,

            checkCompatibility: false

        });



        console.log({
            qdrant:
                process.env.QDRANT_URL,

            key:
                process.env.QDRANT_API_KEY

        });




        /*
        ===============================
        DOWNLOAD PDF
        ===============================
        */


        pdfPath =
            path.join(
                process.cwd(),
                `temp-${Date.now()}.pdf`
            );



        const response = await axios({

            method: "GET",

            url: pdfUrl,

            responseType: "stream"

        });



        const writer =
            fs.createWriteStream(pdfPath);



        response.data.pipe(writer);



        await new Promise(
            (resolve, reject) => {

                writer.on(
                    "finish",
                    resolve
                );

                writer.on(
                    "error",
                    reject
                );

            }
        );



        console.log(
            "📥 PDF Downloaded"
        );





        /*
        ===============================
        LOAD PDF
        ===============================
        */


        const loader =
            new PDFLoader(pdfPath);



        const docs =
            await loader.load();



        console.log(
            "📄 Pages:",
            docs.length
        );






        /*
        ===============================
        CHUNKING
        ===============================
        */


        const splitter =
            new RecursiveCharacterTextSplitter({

                chunkSize: 500,

                chunkOverlap: 50

            });



        const chunks =
            await splitter.splitDocuments(
                docs
            );



        const finalChunks =
            chunks
                .filter(
                    doc =>
                        doc.pageContent &&
                        doc.pageContent.trim().length > 20
                )
                .map(doc => ({

                    pageContent:
                        doc.pageContent,


                    metadata: {

                        source: pdfUrl

                    }

                }));



        console.log(
            "Chunks:",
            finalChunks.length
        );






        /*
        ===============================
        EMBEDDINGS
        ===============================
        */


        const embeddings =
            new GoogleGenerativeAIEmbeddings({

                apiKey:
                    process.env.GOOGLE_API_KEY,


                model:
                    "gemini-embedding-001"

            });





        const test =
            await embeddings.embedQuery(
                "test"
            );


        console.log(
            "Embedding size:",
            test.length
        );






        /*
        ===============================
        QDRANT SAVE
        ===============================
        */


        await QdrantVectorStore.fromDocuments(

            finalChunks,

            embeddings,

            {

                client:
                    qdrantClient,


                collectionName:
                    "ragsystem"

            }

        );



        console.log(
            "✅ Data saved in Qdrant"
        );






        return res.json({

            success: true,

            message:
                "PDF processed successfully",


            chunks:
                finalChunks.length

        });




    }
    catch (error) {


        console.log(
            "❌ RAG ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message

        });


    }


    finally {


        // delete temp pdf

        if (
            pdfPath &&
            fs.existsSync(pdfPath)
        ) {

            fs.unlinkSync(pdfPath);

        }


    }



};