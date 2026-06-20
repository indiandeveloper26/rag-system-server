
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq";
import { QdrantVectorStore } from "@langchain/qdrant";
import { QdrantClient } from "@qdrant/js-client-rest";

export const ragController = async (req, res) => {


    const qdrantClient = new QdrantClient({

        url: process.env.QDRANT_URL,

        apiKey: process.env.QDRANT_API_KEY,

        checkCompatibility: false

    });



    try {


        const { question } = req.body;


        if (!question?.trim()) {

            return res.status(400).json({

                success: false,

                message: "Question required"

            });

        }



        console.log("\n👤 USER:", question);



        // ===============================
        // LLM
        // ===============================

        const llm = new ChatGroq({

            apiKey: process.env.GROQ_API_KEY,

            model: "llama-3.3-70b-versatile",

            temperature: 0.2

        });




        // ===============================
        // AI DECISION AGENT
        // ===============================


        const decision =
            await llm.invoke(`


You are an AI router.

Decide if user needs document search.


Reply ONLY one word:

SEARCH
DIRECT


SEARCH:
- PDF data
- uploaded files
- company information
- stored database information
- names, numbers, records
- project details from document


DIRECT:
- hello
- normal conversation
- coding questions
- general knowledge
- casual chat


User:

${question}


`);




        const action =
            decision.content
                .toString()
                .trim()
                .toUpperCase();



        console.log(
            "🤖 Agent:",
            action
        );





        // ===============================
        // DIRECT ANSWER
        // ===============================


        if (action === "DIRECT") {


            const answer =
                await llm.invoke(`

Answer user normally.

Question:

${question}

`);



            return res.json({

                success: true,

                source: "llm",

                answer: answer.content

            });


        }






        // ===============================
        // RAG SEARCH
        // ===============================


        console.log(
            "📚 Searching Vector DB..."
        );




        // Embedding

        const embeddings =
            new GoogleGenerativeAIEmbeddings({

                apiKey:
                    process.env.GOOGLE_API_KEY,

                model:
                    "gemini-embedding-001"

            });





        // Chroma


        console.log('envdatat', process.env.QDRANT_URL, process.env.QDRANT_API_KEY,)




        const vectorStore =
            await QdrantVectorStore.fromExistingCollection(
                embeddings,
                {
                    client: qdrantClient,

                    collectionName: "ragsystem",
                }
            );



        console.log(
            "✅ Chroma Connected"
        );





        // Search


        const docs =
            await vectorStore.similaritySearch(

                question,

                5

            );



        console.log(
            "📦 Documents:",
            docs.length
        );




        if (!docs.length) {


            return res.json({

                success: true,

                source: "rag",

                answer:
                    "Document me iska data nahi mila."

            });


        }




        // Context


        const context =
            docs
                .map(
                    d => d.pageContent
                )
                .join("\n\n");





        console.log(
            "📄 Context ready"
        );





        // ===============================
        // FINAL AI ANALYSIS
        // ===============================


        const prompt = `


You are an intelligent document assistant.


Use document context and answer user.


Rules:

- Understand the question first.
- Analyze the context.
- Give clear answer.
- Do not create fake document facts.
- If data missing say:
"Document me ye information nahi mili."


DOCUMENT CONTEXT:

${context}


USER QUESTION:

${question}



Answer in Hinglish.


`;





        const result =
            await llm.invoke(prompt);





        return res.json({

            success: true,

            source: "rag",

            answer:
                result.content

        });




    } catch (error) {


        console.error(
            "❌ ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message: error.message

        });


    }



};