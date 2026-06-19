




// import Groq from "groq-sdk";

// const groq = new Groq({
//     apiKey: apiKey
// });

// const chatCompletion =
//     await groq.chat.completions.create({
//         messages: [
//             {
//                 role: "user",
//                 content: " how are u bro",
//             },
//         ],
//         model: "llama-3.3-70b-versatile",
//     });

// console.log(
//     chatCompletion.choices[0].message.content
// );



import dotenv from "dotenv";
dotenv.config();

import { ChatGroq } from "@langchain/groq";

async function main() {
    try {
        const llm = new ChatGroq({
            apiKey: apiKey,
            model: "llama-3.3-70b-versatile",
            temperature: 0,
        });

        console.log("🚀 Before LLM");

        const res = await llm.invoke(" can u tell how to groth is money");

        console.log("✅ After LLM");
        console.log(res.content);

    } catch (error) {
        console.error("❌ Error:", error);
    }
}

main();